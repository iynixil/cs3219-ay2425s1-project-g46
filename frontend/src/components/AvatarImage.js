import React, { useState } from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Avatar from 'react-avatar-edit';
import './styles/AvatarImage.css';

export default function AvatarImage() {
    const [dialogs, setDialogs] = useState(false);
    const [imgCrop, setImgCrop] = useState(null);
    const [storeImage, setStoreImage] = useState(null);

    const onCrop = (view) => {
        setImgCrop(view);
    };

    const onClose = () => {
        setImgCrop(null);
    };

    const saveImage = () => {
        setStoreImage(imgCrop);
        setDialogs(false);
    };

    return (
        <div className='profile-img-container'>
            <div className='avatar-wrapper'>
                <img 
                    className="profile-avatar"
                    src={storeImage || `${process.env.PUBLIC_URL}/human_icon.jpg`}
                    alt="Profile Icon"
                    onClick={() => setDialogs(true)}
                />
                <Dialog
                    visible={dialogs}
                    onHide={() => setDialogs(false)}
                    className="custom-dialog"
                    closable={false}  
                >
                    <div className="dialog-content">
                        <button 
                            onClick={() => setDialogs(false)}
                            className="dialog-close-button"
                        >
                            &times;
                        </button>
                        
                        <div className='confirmation-content'>
                            <div className='avatar-edit-container'>
                                <Avatar
                                    width={390}
                                    height={295}
                                    onCrop={onCrop}
                                    onClose={onClose}
                                />
                                <Button onClick={saveImage} label='Save' icon="pi pi-check" className="save-button" />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};
