import formidable from 'formidable';
import fs from 'fs-extra';
import archiver from 'archiver';
import Server from 'socket.io';
//import io from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req, res) => {
 
    if (req.method === 'POST') {
        const guid = createDirectory();
        const form = new formidable.IncomingForm();
        
        form.uploadDir = "./uploads/" + guid;
        form.keepExtensions = true;
        form.maxFileSize = 10000 * 1024 * 1024;

        form.on('fileBegin', (name, file) => {
            file.path = form.uploadDir + '/' + file.name;
        });
        form.on('progress', (recv, exp) => {
            const percent = (recv / exp) * 100;
            res.socket.server.io.sockets.in('sessionId').emit('uploadProgress', percent);
        });

        //form.parse(req);
        setTimeout(() => {
            form.parse(req, (err, fields, files) => {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ files, 'guid':guid }, null, 2));
                zipDirectory(guid);
            });
        }, 50);

    } else {
        if (!res.socket.server.io) {
            console.log('*First use, starting socket.io')

            const io = new Server(res.socket.server)
            io.on('connection', socket => {
                socket.broadcast.emit('a user connected')
                socket.on('hello', msg => {
                    socket.emit('hello', 'world!')
                })
            })
            res.socket.server.io = io

        } else {
            console.log('socket.io already running')
        }
        res.end()
    }
}

const createDirectory = () => {

    let guid = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
    while (fs.existsSync('./' + guid + '.zip')) {
        guid = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
    }

    fs.mkdir('./uploads/' + guid, (err) => { 
        if (err) { 
            res.statusCode = 500;
            res.end();
        } 
    });
    return guid;
}

const zipDirectory = (guid) => {
    const output = fs.createWriteStream('./uploads/' + guid + '.zip');
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
        fs.removeSync('./uploads/' + guid, { recursive: true });
    });

    archive.pipe(output);
    archive.directory('./uploads/' + guid, false);
    archive.finalize();
}
