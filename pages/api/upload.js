import formidable from 'formidable';
import fs from 'fs-extra';
import archiver from 'archiver';

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
        form.on('fileBegin', (name, file) => {
            file.path = form.uploadDir + '/' + file.name;
        });

        form.parse(req, (err, fields, files) => {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ files, 'guid':guid }, null, 2));
            zipDirectory(guid);
        });

    } else {
        res.statusCode = 400;
        res.end();
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
