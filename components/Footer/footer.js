import React, { Component } from 'react'
import styles from './footer.module.scss'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <img src="/images/logo.svg" alt="Bryce Yoder"/>
            <span>Created by Bryce Yoder</span>
        </footer>
    )
}
