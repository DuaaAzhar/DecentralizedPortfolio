import React, { useEffect, useState} from 'react'
import { Modal, ModalBody, Row } from "reactstrap"
import './Hero.css'

const Hero = ({ state }) => {
  const [modal, setModal] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  //To get description from smart contract
  useEffect(() => {
    const { contract } = state;
    const description = async () => {
      const descriptionText = await contract.methods.description().call();
      setDescription(descriptionText);
    };
    contract && description();
  }, [state]);

  //To get Image from smart contract
  useEffect(() => {
    const { contract } = state;
    const cid = async () => {
      const cidLink = await contract.methods.imageLink().call();
      setImage(cidLink);
    };
    contract && cid();
  }, [state]);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-text">
          <p>
            <span>Duaa Azhar </span>
            is a Full-Stack Blockchain Developer From Pakistan.
          </p>
          <h1>I develop decentralized apps in Blockchain space.</h1>
          <h3>{description}</h3>
          {/*  =========popup bootstrap==========  */}

          <Modal size="md" isOpen={modal} toggle={() => setModal(!modal)}>
            <ModalBody>
              <Row className="text-align">
                <label htmlFor="" toggle={() => setModal(!modal)}>
                  Mail Id - duaaazhar04@gmail.com
                </label>
              </Row>
            </ModalBody>
          </Modal>

                <button className="msg-btn" onClick={() => setModal(true)}>Get in Touch</button>
                {/*  =========popup bootstrap end==========  */}

            </div>
            <div className="hero-img">

                <div className="img-container">
                <img src={`https://magenta-alleged-falcon-434.mypinata.cloud/ipfs/QmR9VyCCgdHoJdN6jsBw7QsNFCYwNsrxRbpcSAaGEGPSnD/${image}`} alt="profilePhoto" />
                </div>
            </div>
        </div>
    </section>
  );
};

export default Hero;
