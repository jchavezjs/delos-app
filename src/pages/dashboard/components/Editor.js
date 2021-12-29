import {useState, useEffect} from 'react';
import {Form, Input, Button, Row, Col, Upload, message} from 'antd';
import cx from 'classnames';
import produce from 'immer';
import {ReactComponent as Feedback} from '../assets/feedback.svg';
import styles from '../styles/Editor.module.css';

const {TextArea} = Input;
const rectangles = [];
// Temp variables
let startX = 0;
let startY = 0;
const marqueeRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  name: '',
  id: 0,
  class: 'yellow',
};

var addid = 0;

const Editor = () => {
  const [inputs, handleInputs] = useState([]);
  const [image, hanldeImage] = useState('');

  useEffect(() => {
    const $ = document.querySelector.bind(document);

    /**
     * Collection of rectangles defining user generated regions
     */

    // DOM elements
    const $screenshot = $('#screenshot');
    const $draw = $('#draw');
    const $marquee = $('#marquee');
    const $boxes = $('#boxes');
    $marquee.classList.add('hide');
    $screenshot.addEventListener('pointerdown', startDrag);

    // Add Input

    function addInput(id) {
        
        var addList = document.getElementById('addlist');

        if (!id) {
            id = addid;
        }

        var text = document.createElement('div');
        text.id = 'additem_' + id;
        // text.innerHTML = "<input placeholder='" + id + "' id='i_" + id + "' type='text' value='' class='buckinput' name='items[]' onChange='renameInput("+ id +")' style='padding:5px;' /> <a href='javascript:void(0);' onclick='removeInput(" + id + ")' id='addlink_" + id + "'>Remove</a>";
        text.innerHTML = "<input placeholder='" + id + "' id='i_" + id + "' type='text' value='' class='buckinput' name='items[]' onChange='renameInput("+ id +")' style='padding:5px;' />";

        addid++;
        addList.appendChild(text);
    }

    function removeInput(id) {
        var text = document.createElement('div');
        var item = document.getElementById(`additem_${id}`);

        var addList = document.getElementById('addlist');

        var rmv = addList.removeChild(item);
    }

    /* function renameInput(id) {
        var text = document.createElement('div');
        var item = document.getElementById(`i_${id}`);
        var new_name = item.value.toLowerCase();

        item.setAttribute("name", new_name);

        console.log(item);
    } */

    //

    function startDrag(ev) {
      // middle button delete rect
      if (ev.button === 2) {
        const rect = hitTest(ev.layerX, ev.layerY);
        if (rect) {
          // removeInput(rect.id);
          rectangles.splice(rectangles.indexOf(rect), 1);
          // handleInputs(rectangles);
          redraw();
        }
        return;
      }
      window.addEventListener('pointerup', stopDrag);
      $screenshot.addEventListener('pointermove', moveDrag);
      $marquee.classList.remove('hide');
      startX = ev.layerX;
      startY = ev.layerY;
    }

    function stopDrag(ev) {
        $marquee.classList.add('hide');
        window.removeEventListener('pointerup', stopDrag);
        $screenshot.removeEventListener('pointermove', moveDrag);
        /* if (ev.target === $screenshot && marqueeRect.width && marqueeRect.height) {
          // Assign ID to rectangle
          marqueeRect.id = addid;
          rectangles.push(Object.assign({}, marqueeRect));
          // Add Input
          // addInput();
  
          // Re Draw Rectangles
          redraw();
        } */

        // Assign ID to rectangle
        marqueeRect.id = addid;
        const newRectangle = Object.assign({}, marqueeRect);
        rectangles.push(newRectangle);
        handleInputs(rectangles);
        // Add Input
        // addInput();

        // Re Draw Rectangles
        redraw();
        
    }

    function moveDrag(ev) {
      let x = ev.layerX;
      let y = ev.layerY;
      let width = startX - x;
      let height = startY - y;
      if (width < 0) {
        width *= -1;
        x -= width; 
      }
      if (height < 0) {
        height *= -1;
        y -= height;
      }
      Object.assign(marqueeRect, { x, y, width, height });
      drawRect($marquee, marqueeRect);
    }

    function hitTest(x, y) {
      return rectangles.find(rect => (
        x >= rect.x &&
        y >= rect.y && 
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height
      ));
    }

    function redraw() {
      $boxes.innerHTML = '';
      rectangles.forEach((data) => {
            $boxes.appendChild(drawRect(
                document.createElementNS("http://www.w3.org/2000/svg", 'rect'), data
            ));
        });
    }
  
    function drawRect(rect, data) {
      const { x, y, width, height } = data; //
      rect.setAttributeNS(null, 'width', width);
      rect.setAttributeNS(null, 'height', height);
      rect.setAttributeNS(null, 'x', x);
      rect.setAttributeNS(null, 'y', y);
      return rect;
    }

  }, []);

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

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = info => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        hanldeImage(imageUrl);
      });
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const InputImage = () => (
    <div className={styles.inputImage}>
      <div />
      <Input size="large" className={styles.input} />
    </div>
  );

  return (
    <div className={styles.editor}>
      <h1 className={styles.title}>New Campaign</h1>
      <div className={styles.form}>
        <Form
          name="campaign"
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          colon={false}
          requiredMark={false}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={20}>
            <Col flex="auto">
              <Form.Item
                label={
                  <span className={styles.label}>
                    Title of the campaign
                  </span>
                }
                name="title"
              >
                <Input size="large" className={styles.input} />
              </Form.Item>
            </Col>
            <Col flex="100px">
              <Form.Item
                label={
                  <span className={cx(styles.label, styles.versionLabel)}>
                    Version
                  </span>
                }
                name="version"
              >
                <Input size="large" className={styles.input} />
              </Form.Item>
            </Col>
            <Col flex="120px">
              <Form.Item
                label={
                  <span className={styles.label}>
                    Reward in EFX
                  </span>
                }
                name="reward"
              >
                <Input size="large" className={styles.input} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label={
                  <span className={styles.label}>
                    Description
                  </span>
                }
                name="description"
              >
                <TextArea rows={4} className={styles.textArea} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={styles.addImageWrap}>
                <span className={styles.label}>
                  Add new image to be processed
                </span>
                <Upload
                  name="image"
                  customRequest={dummyRequest}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  showUploadList={false}
                  onChange={handleChange}>
                  <Button size="large" className={styles.addImage} type="primary">
                    Add Image
                    <span className="material-icons-round">
                      add
                    </span>
                  </Button>
                </Upload>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {/* !image.length ? (
                <div className={styles.previewImage}>
                  <span className="material-icons-round">
                    collections
                  </span>
                </div>
              ) : (
                <div className={styles.imageWrapper}>
                  <div className={styles.image}>
                    <img src={image} alt="" draggable={false} />
                    <svg id="draw" className={styles.draw} xmlns="http://www.w3.org/2000/svg">
                      <rect id="marquee" className={styles.marquee} x="0" y="0" width="0" height="0" />
                      <g id="boxes"></g>
                    </svg>
                  </div>
                  <script async src="../utils/widget.js"></script>
                </div>
              ) */}
              <div className={styles.imageWrapper}>
                  <div className={styles.image} id="screenshot">
                    <img src={image} alt="" draggable={false} />
                    <svg id="draw" className={styles.draw} xmlns="http://www.w3.org/2000/svg">
                      <rect id="marquee" className={styles.marquee} x="0" y="0" width="0" height="0" />
                      <g id="boxes" className={styles.boxes}></g>
                    </svg>
                  </div>
                </div>
              <div className={styles.feedbackWrap}>
                <Feedback className={styles.feedbackIcon} />
                <span className={styles.feedback}>
                  Draw a rectangle over the part of the image you need get the information
                  to and we will automatically categorize the data of your images.
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={styles.inputs}>
                {inputs.map(input => (
                  <InputImage input={input} />
                ))}
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Editor;
