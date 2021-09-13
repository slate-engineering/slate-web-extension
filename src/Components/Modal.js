import React, { useState, useEffect } from 'react';
import { ModalContext } from '../Contexts/ModalProvider';
import Button from '../Components/Button';
import Metadata from '../Components/Metadata';
import Header from '../Components/Header';
import * as Icons from '../Components/Icons';
import classes from '../App.module.css';
import HomePage from '../Pages/Home';
import ShortcutsPage from '../Pages/Shortcuts';
import AccountPage from '../Pages/Account';
require('typeface-inter');

const Modal = (props) => {
  const [search, setSearch] = useState({ query: null });
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState({ show: false });
  const [og, setOg] = useState({ image: null, title: null });

  const [page, setPage] = useState({ active: 'home' });  

  const handleCloseModal = () => {
    window.postMessage({ type: "CLOSE_APP" }, "*");
  }

  window.addEventListener("message", function(event) {
    /*
    if(event.data.type === "LOAD_APP_WITH_TAGS") {
      setTags({ show: true })
    }
    */

    if(event.data.run === "OPEN_HOME_PAGE") {
      setPage({ active: 'home' })
    }

    if(event.data.run === "OPEN_SHORTCUTS_PAGE") {
      setPage({ active: 'shortcuts' })
    }

    if(event.data.run === "OPEN_ACCOUNT_PAGE") {
      setPage({ active: 'account' })
    }
  });

  return (
    <ModalContext.Consumer>
      {({ pageData }) => (
      <>
        <div id="modal" className={classes.modalWindow}>
            <div className={classes.modalContent}>

            {page.active === 'home' &&
              <HomePage
                pageData={pageData}
                image={props.image} 
                favicon={props.favicon}
              />
            }
            
            {page.active === 'shortcuts' &&
              <ShortcutsPage />
            }

            {page.active === 'account' &&
              <AccountPage />
            }

              {/*
              <Header />

              <table style={{ textAlign: 'left', paddingLeft: '32px', width: '100%', marginTop: '8px' }}>
                <tr style={{ borderBottom: '1px solid #E5E8EA', color: '#8E9093', marginTop: '8px' }}>
                  <th style={{ marginLeft: '16px', fontWeight: '400' }}>Name</th>
                  <th style={{ fontWeight: '400' }}>Shortcut</th>
                </tr>
                <tr style={{ width: '50%' }}>
                  <td>Open Slate Extension</td>
                  <td>
                    <span className={classes.modalShortcut}>⌥</span> 
                    <span className={classes.modalShortcut}>B</span>
                  </td>
                </tr>
                <tr>
                  <td>Close Slate Extension</td>
                  <td className={classes.modalShortcut}>esc</td>
                </tr>
              </table>


              
                <div className={classes.modalSearchBar}>
                  <Search />
                </div>
            
              <Header />

              <Metadata
                data={pageData} 
                image={props.image} 
                favicon={props.favicon}
              />

              <div style={{ paddingTop: '16px', marginBottom: '12px', }}>
                <Button 
                  text="Add to my library"
                  shortcut="B"
                  icon="plus"
                  run="SAVE_LINK"
                  data={pageData}
                />

                <p style={{ marginLeft: '32px', color: '#8e9093', paddingTop: '8px', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>System</p>

                <Button 
                  text="Shortcuts"
                  shortcut="C"
                  icon="command"
                />

                <Button 
                  text="Account"
                  shortcut="A"
                  icon="account"
                  onClick={handleShowAccount}
                  data={pageData}
                /> 
              </div>   

              tags.show ? (
                <h2>Show tags now</h2>
              ) : (
                <h2>Dont show tags</h2>
              )
              */}
            </div>
          </div>
        <div className={classes.modalBackground} onClick={handleCloseModal}></div>
      </>
      )}
    </ModalContext.Consumer>
  );
};

export default Modal;
