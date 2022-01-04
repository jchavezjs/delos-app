import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Upload, message, Row, Col, Button} from 'antd';
import produce from 'immer';
import cx from 'classnames';
import {ReactComponent as Feedback} from '../assets/feedback.svg';
import {uploadImage, createBatch} from '../../../redux/slices/campaigns';
import {selectUser} from '../../../redux/slices/user';
import styles from '../styles/CreateBatch.module.css';

const {Dragger} = Upload;

const CreateBatch = ({close, campaign, renewInfo}) => {
  const [images, handleImages] = useState([]);
  const [sending, handleSending] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  /* function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  } */

  const getBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  });

  async function dataUrlToFile(dataUrl){
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], 'image.png', { type: 'image/png' });
  }

  const PrevImage = ({image, index}) => {
    return (
      <Col span={8}>
        <div className={styles.preview} style={{backgroundImage: `url(${image})`}}>
          <div className={styles.remove} onClick={() => removeImage(index)}>
            <span className="material-icons-round">
              remove
            </span>
          </div>
        </div>
      </Col>
    );
  };

  const handleChange =  async ({file}) => {
    if (file.status === 'done') {
      const uri = await getBase64(file.originFileObj);
      const newImages = produce(images, draftState => {
        draftState.push(uri);
      });
      handleImages(newImages);
      /* getBase64(info.file.originFileObj, imageUrl => {
      }); */
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const removeImage = index => {
    const newImages = produce(images, draftState => {
      draftState.splice(index, 1);
    });
    handleImages(newImages);
  };

  const createNewBatch = async () => {
    handleSending(true);
    if (images.length > 0) {
      const uris = [];
      await Promise.all(images.map(async newImg => {
        const newFile = await dataUrlToFile(newImg);
        const info = new FormData();
        info.append('task', newFile);
        const response = await dispatch(uploadImage(info));
        if (response.status === 'success') {
          uris.push({image_url: response.url});
        }
      }));
      const info = {
        id: user.id,
        id_campaign: campaign.id,
        tasks: uris,
      };
      const response = await dispatch(createBatch(info));
      if (response.status === 'success') {
        await renewInfo(true);
        message.success('Batch created');
        close();
      } else {
        message.error('Try again later');
      }
    } else {
      message.error('Add an image to continue');
    }
    handleSending(false);
  };

  const code = `const axios = require(‘axios’);

  var config = {
    method: 'post',
    url: 'https://delos-on.herokuapp.com/v1/batch',
    headers: {
      Authorization: 'Bearer ${localStorage.getItem('delos_user')}'
    },
    data: {
      id: ${user.id},
      id_campaign: ${campaign.id},
      task: (Your file),
    }
  };`;


  return (
    <div className={styles.createBatch}>
      <div className={styles.header}>
        <div className={styles.close} onClick={close}>
          <span className="material-icons-round">
            close
          </span>
        </div>
        <span className={styles.title}>Batch</span>
      </div>
      <span className={styles.description}>
        Add the Document or batch of documents you want to process.
      </span>
      <div className={styles.uploader}>
        <Dragger
          className={styles.dragger}
          onChange={handleChange}
          customRequest={dummyRequest}
          showUploadList={false}
          beforeUpload={beforeUpload}>
          <span className="material-icons-round">
            perm_media
          </span>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company
            data or other band files.
          </p>
        </Dragger>
      </div>
      <div className={styles.feedbackWrap}>
        <Feedback className={styles.feedbackIcon} />
        <span className={styles.feedback}>
          Upload multiple files .jpg or .png. Each file will be a micro task that our WorkForce will have to complete.
        </span>
      </div>
      <div className={styles.listImgs}>
        <Row gutter={[20, 20]}>
          {images.map((image, index) => (
            <PrevImage key={index.toString()} image={image} index={index} />
          ))}
        </Row>
      </div>
      <div className={styles.itemSubmit}>
        <Button
          type="primary"
          size="large"
          loading={sending}
          onClick={createNewBatch}
          className={styles.submit}>
          Create Batch
          <span className="material-icons-round">
            add
          </span>
        </Button>
      </div>
      <div className={styles.apiWrap}>
        <span className={styles.title}>API</span>
        <span className={cx(styles.description, styles.descriptionAPi)}>
          You can use our API in order to add more tasks on the fly.
        </span>
        <div className={styles.codeWrap}>
        <pre className={styles.code}>
{code}
        </pre>
        <div className={styles.copyWrap} onClick={() => {navigator.clipboard.writeText(code);}}>
          <span className="material-icons-round">
            content_copy
          </span>
        </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBatch;