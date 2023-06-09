import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Toast } from '../utilities/notifications';
import { Toaster } from 'react-hot-toast';

const NewPostModal = ({ show, handleClose, handleNewPost }) => {

  const successToast = new Toast("Post pubblicato con successo");
  const errorToast = new Toast("Errore durante la creazione del post");

  const [formData, setFormData] = useState({// Inizializza lo stato del form e del file
    title: '',
    content: '',
    author: '',
    rate: '',
    img: ''
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => { // Gestisce il cambiamento dell'input del form
    const { name, value, files } = e.target;
    if (name === 'file') { // Se l'input è un file. qui controllavo se il type era un file, ma devo controllare il nome
      setFile(files[0]); // Imposta il file come il primo file selezionato
    } else {
      setFormData((prevState) => ({ // Aggiorna lo stato del form con il nuovo valore dell'input
        ...prevState,
        [name]: value
      }));
    }
  };

  /* errori in handleInputChange: stavo gestendo come un normale 
  input di testo mentre il mio input è un oggetto file non una stringa */

  const uploadFile = async (file) => {  // Carica il file
    console.log('uploadFile è stata chiamata con il file:', file); //!!!!! non viene visualizzato in console
    const fileData = new FormData();
    fileData.append('img', file);
    //console.log(fileData)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/cloudUpload`, { // Effettua una richiesta POST per caricare il file
        method: 'POST',
        body: fileData,
      });

      if (!response.ok) {
        throw new Error("Errore durante l'upload del file");
      }

      return await response.json(); // Ritorna la risposta come JSON
    } catch (error) {
      console.error('Upload del file non riuscito:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {  // Gestisco l'invio del form
    e.preventDefault();
    try {
      let img = '';
      if (file) {
        const response = await uploadFile(file);
        img = response.img; //assegna l'URL dell'immagine a 'img'
        console.log("URL immagine:", img); // Log dell'URL dell'immagine
      }

      const postData = {
        ...formData, // Copia tutti i campi del modulo nella variabile 'postData'
        img // Aggiunge l'URL dell'immagine alla variabile 'postData'
      };
      console.log('Dati post:', postData); // Log dei dati del post //!!!! questo log mi restituisce img: ""

      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error('Errore durante la creazione del post');
      }

      const { post: newPost } = await response.json(); // Estrae il nuovo post dalla risposta come oggetto 'newPost'
      successToast.success('Post pubblicato con successo');
      handleNewPost(newPost); // Aggiorna la lista dei post chiamando la funzione 'handleNewPost'
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Errore durante la creazione del post:', error);
      errorToast.error('Errore nella pubblicazione del post');
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
            <Form.Control
              type="text"
              placeholder="Inserisci il tuo nome..."
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="rate">
            <Form.Label>Voto</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci un voto da 1 a 5..."
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
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


