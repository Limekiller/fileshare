import { Component } from 'react'
import { withRouter } from 'next/router'

import styles from './uploadBox.module.scss'

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

        const dt = e.dataTransfer;
        const files = dt.files;

        this.handleFiles(files);
        this.setState({ hovered: false })
    };

    render() {
        return (
            <>
                <input 
                    id='fileInput' 
                    className={ styles.fileInput } 
                    type="file" 
                    multiple 
                    onChange={e => this.handleFiles()}
                />
                <div 
                    type='file' 
                    multiple 
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
                        <div className={styles.file}>
                            <i className={this.getFileType(file)}></i>
                            <span className={styles.filename}>{file.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex center">
                    <button onClick={e => this.uploadFiles(e)}>Upload</button>
                </div>
            </>
        )
    }

    handleFiles(files=null) {
        if (files === undefined || files === null) {
            const fileInput = document.querySelector('#fileInput');
            files = fileInput.files;
        }

        let filesToMerge = [];
        for (let i = 0; i < files.length; i++) {
            filesToMerge.push(files[i]);
        }
        
        this.setState({ files: filesToMerge });
    }

    getFileType(file) {
        const typeIcons = {
            'image': 'fas fa-file-image',
            'video': 'fas fa-file-video',
            'audio': 'fas fa-file-audio',
            'font': 'fas fa-font',
            'text': 'fas fa-file-alt',
        }
        return typeIcons[file.type.split('/')[0]];
    }

    uploadFiles(e) {
        const formData = new FormData();
        this.state.files.forEach((file, index) => {
            formData.append(file.name, file);
        });

        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            data = JSON.parse(data);
            window.location.href = '/share/' + data['guid'];
        })
    }
}
