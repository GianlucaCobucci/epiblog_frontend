import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Toast } from '../utilities/notifications';
import { Toaster } from 'react-hot-toast';
import useDecodedSession from '../hooks/useDecodedSession';

const NewPostModal = ({ show, handleClose }) => {
  const successToast = new Toast("Post pubblicato con successo");
  const errorToast = new Toast("Errore durante la creazione del post");

  const actualUser = useDecodedSession();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    rate: 0,
    img: ''
  });

  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFile(files[0]);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleRateChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      rate: Number(event.target.value)
    }));
  };

  const uploadFile = async (file) => {
    const fileData = new FormData();
    fileData.append('img', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/cloudUpload`, {
        method: 'POST',
        body: fileData,
      });

      if (!response.ok) {
        throw new Error("Errore durante l'upload del file");
      }

      return await response.json();
    } catch (error) {
      console.error('Upload del file non riuscito:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        const uploadedFile = await uploadFile(file);
        const postFormData = {
          ...formData,
          img: uploadedFile.img
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(postFormData)
        });

        if (response.ok) {
          successToast.success();
        } else {
          errorToast.show();
        }

        return await response.json();
      } catch (error) {
        console.log(error);
        errorToast.error();
      }
    } else {
      console.error("Scegli almeno un file");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <Modal.Header closeButton>
        <Modal.Title>Nuovo post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group controlId="title">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il titolo del post..."
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Contenuto</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Inserisci il contenuto del post..."
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="author">
            <Form.Label>Autore</Form.Label>
            <Form.Select
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            >
              <option>Scegli autore</option>
              <option value={actualUser?.id}>
                {actualUser?.firstName}
                {actualUser?.lastName}
              </option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="rate">
            <Form.Label>Voto</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci un voto da 1 a 5..."
              name="rate"
              value={formData.rate}
              onChange={handleRateChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Carica file</Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" type="submit" className="mx-auto mt-3">
              Pubblica
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewPostModal;


