import React from 'react';
import classes from '../App.module.css';

export const Close = (props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 5L15 15" stroke="#48494A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
};

export const Bookmark = (props) => {
  return(
    <svg className={classes.modalButtonSVGItem} style={{ marginLeft: '2px', paddingTop: '4px' }} width="14" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 19L8 14L1 19V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H13C13.5304 1 14.0391 1.21071 14.4142 1.58579C14.7893 1.96086 15 2.46957 15 3V19Z" stroke="#00050A" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export const Tag = (props) => {
  return(
    <svg className={classes.modalButtonSVGItem} style={{ paddingTop: '4px' }} width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 12.41L12.42 19.58C12.2343 19.766 12.0137 19.9135 11.7709 20.0141C11.5281 20.1148 11.2678 20.1666 11.005 20.1666C10.7422 20.1666 10.4819 20.1148 10.2391 20.0141C9.99632 19.9135 9.77575 19.766 9.59 19.58L1 11V1H11L19.59 9.59C19.9625 9.96473 20.1716 10.4716 20.1716 11C20.1716 11.5284 19.9625 12.0353 19.59 12.41V12.41Z" stroke="#00050A" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export const PlusCircle = (props) => {
  return(
    <svg 
        className={classes.modalButtonSVGItem} 
        style={{ marginTop: '4px', marginRight: '-6px' }} 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#00050A" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  )
}

export const Account = (props) => {
  return(
    <svg width="20" height="20" style={{ marginTop: '14px' }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.3334 16V14.6667C15.3334 13.9594 15.0524 13.2811 14.5523 12.781C14.0522 12.281 13.3739 12 12.6667 12H7.33335C6.62611 12 5.94783 12.281 5.44774 12.781C4.94764 13.2811 4.66669 13.9594 4.66669 14.6667V16" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9.99998 9.33333C11.4727 9.33333 12.6666 8.13943 12.6666 6.66667C12.6666 5.19391 11.4727 4 9.99998 4C8.52722 4 7.33331 5.19391 7.33331 6.66667C7.33331 8.13943 8.52722 9.33333 9.99998 9.33333Z" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export const Command = (props) => {
  return( 
    <svg width="20" height="20" style={{ marginTop: '14px' }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4C13.4696 4 12.9609 4.21071 12.5858 4.58579C12.2107 4.96086 12 5.46957 12 6V14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14C16 13.4696 15.7893 12.9609 15.4142 12.5858C15.0391 12.2107 14.5304 12 14 12H6C5.46957 12 4.96086 12.2107 4.58579 12.5858C4.21071 12.9609 4 13.4696 4 14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16C6.53043 16 7.03914 15.7893 7.41421 15.4142C7.78929 15.0391 8 14.5304 8 14V6C8 5.46957 7.78929 4.96086 7.41421 4.58579C7.03914 4.21071 6.53043 4 6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6C4 6.53043 4.21071 7.03914 4.58579 7.41421C4.96086 7.78929 5.46957 8 6 8H14C14.5304 8 15.0391 7.78929 15.4142 7.41421C15.7893 7.03914 16 6.53043 16 6C16 5.46957 15.7893 4.96086 15.4142 4.58579C15.0391 4.21071 14.5304 4 14 4Z" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export const Plus = (props) => {
  return( 
    <svg width="20" height="20" style={{ marginTop: '12px' }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 5.33332V14.6667" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.33331 10H14.6666" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export const ChevronLeft = (props) => {
  return( 
    <svg width="16" height="16" style={{ marginTop: '6px' }} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 12L6 8L10 4" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export const Link = (props) => {
  return( 
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="16px"
      height="16px"
      style={{ marginTop: '8px' }}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export const Uploads = (props) => {
  return( 
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '14px' }}>
      <path d="M7.33331 6H16" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.33331 10H16" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.33331 14H16" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 6H4.00667" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 10H4.00667" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 14H4.00667" stroke="#00050A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}
