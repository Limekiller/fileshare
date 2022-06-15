import { Component } from 'react'
import { withRouter } from 'next/router'
import io from 'socket.io-client';

import styles from './uploadBox.module.scss'
import JSZip from 'jszip';

export default class UploadBox extends Component {

    constructor({props, router}) {
        super(props);
        this.state = {
            hovered: false,
            files: []
        };
    }

    handleClick(e) {
        if (document.querySelector('#fileInput')) {
            document.querySelector('#fileInput').click();
        }
    }
    handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    };
    handleDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ hovered: true })
    };
    handleDragLeave(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ hovered: false })
    }
    handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        const items = e.dataTransfer.items;
        let entries = [];
        for (let i = 0; i < items.length; i++) {
            entries.push(items[i].webkitGetAsEntry());
        }
        let files = [];
        this.handleEntries(entries, files);

        setTimeout(() => {
            this.setState({files: files})
        }, 100);
        this.setState({hovered: false})
    };

    render() {
        return (
            <>
                <div id='loadingBar' className={styles.loadingBar}>
                    <h1 id='loadingPercent' className={styles.loadingPercent} />
                </div>
                <input
                    id='fileInput'
                    className={ styles.fileInput }
                    type="file"
                    multiple=""
                    onChange={e => this.handleEntries()}
                />
                <div
                    type='file'
                    id='uploadBox'
                    className={`
                        flex wrap
                        ${styles.uploadBox}
                        ${this.state.hovered ? styles.active : ''}
                    `}
                    onDragOver={e => this.handleDragOver(e)}
                    onDragEnter={e => this.handleDragEnter(e)}
                    onDrop={e => this.handleDrop(e)}
                    onDragLeave={e => this.handleDragLeave(e)}
                    onClick={e => this.handleClick(e)}
                >
                    {this.state.files.map((file, index) => (
                        <div className={styles.file} key={file.webkitRelativePath}>
                            <i className={this.getFileType(file)}></i>
                            <span className={styles.filename}>{file.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex center pad-bottom">
                    <button onClick={e => this.uploadFiles(e)}>Upload</button>
                </div>
            </>
        )
    }

    handleEntries(entries=null, files=[]) {
        if (entries == null) {
            const inputFiles = document.querySelector('#fileInput').files;
            for (let i = 0; i < inputFiles.length; i++) {
                files.push(inputFiles[i]);
            }
            this.setState({files: files});
        } else {
            entries.forEach(entry => {
                if (entry.isDirectory) {
                    entry.createReader().readEntries(entries => this.handleEntries(entries, files));
                } else {
                    entry.file(file => files.push(file));
                }
            })
        }
    }

    getFileType(file) {
        let typeIcon = 'fas fa-file-alt'
        const typeIcons = {
            'image': 'fas fa-file-image',
            'video': 'fas fa-file-video',
            'audio': 'fas fa-file-audio',
            'font': 'fas fa-font',
            'text': 'fas fa-file-alt',
        }
        if (typeIcons[file.type.split('/')[0]]) {
            typeIcon = typeIcons[file.type.split('/')[0]]
        }

        return typeIcon;
    }

    uploadFiles(e) {

        if (!document.querySelector('#uploadBox').hasChildNodes()) {
            return false;
        }

        let zip = new JSZip();
        this.state.files.forEach((file, index) => {
            if (file.webkitRelativePath !== '') {
                zip.file(file.webkitRelativePath, file, {createFolders: true});
            } else {
                zip.file(file.name, file, {createFolders: true})
            }
        });

        zip.generateAsync({type:"blob"}).then(function(content) {
            let formData = new FormData();
            formData.append('upload.zip', content);
    
            fetch('/api/upload').finally(() => {
                const socket = io()
    
                fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    data = JSON.parse(data);
                    window.location.href = '/share/' + data['guid'];
                })
    
                socket.on('uploadProgress', percent => {
                    document.querySelector('#loadingBar').style.width = percent + 'vw';
                    document.querySelector('#loadingPercent').innerHTML = percent.toFixed(2) + '%';
                });
            })
        })
    }
}
