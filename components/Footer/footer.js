import React, { Component } from 'react'
import styles from './footer.module.scss'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div class='flex'>
                <Link href='/'>
                    <a><i class="fas fa-home"></i></a>
                </Link>
                <Link href='/share'>
                    <a><i class="fas fa-file-upload"></i></a>
                </Link>
                <Link href='/download'>
                    <a><i class="fas fa-file-download"></i></a>
                </Link>

            </div>
            <a className={styles.siteLogo} href='https://bryceyoder.com'>
                <img src="/images/logo.svg" alt="Bryce Yoder"/>
            </a>
        </footer>
    )
}
