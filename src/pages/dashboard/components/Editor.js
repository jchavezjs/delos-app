import {useState, useEffect, useRef} from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Upload,
  message,
  Modal,
  Drawer,
} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useScreenshot} from 'use-react-screenshot';
import cx from 'classnames';
import {ReactComponent as Feedback} from '../assets/feedback.svg';
import {createCampaign} from '../../../redux/slices/campaigns';
import {selectUser} from '../../../redux/slices/user';
import CreateBatch from './CreateBatch';
import TaskDetails from './TaskDetails';
import styles from '../styles/Editor.module.css';

const {TextArea} = Input;
// Temp variables
let startX = 0;
let startY = 0;
const marqueeRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  name: '',
};

const colors = [
  '#2C1361',
  '#FFC400',
  '#D53678',
  '#6223E2',
  '#00B68F',
  '#FCB0B3',
  '#6ACCC2',
  '#FF5345',
  '#ABA1C0',
  '#178DC1',
  '#00BAFF',
  '#303EDE',
  '#F0EFF7'
];

const useForceUpdate = () => {
  const [, setState] = useState();
  return () => setState({});
}

const Editor = ({mode, campaign, renewInfo}) => {
  const isNew = mode === 'new';
  const [createBatch, handleCreateBatch] = useState(false);
  const [taskDetails, handleTaskDetails] = useState(false);
  const [task, handleTask] = useState(null);
  const rectangles = useRef([]);
  const [image, handleImage] = useState('');
  const [sending, handleSending] = useState(false);
  const [sshot, takeScreenshot] = useScreenshot();
  const screenshot = useRef(null);
  const marquee = useRef(null);
  const boxes = useRef(null);
  const forceUpdate = useForceUpdate();
  const user =  useSelector(selectUser);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    rectangles.current = [];
    if (isNew) {
      marquee.current.classList.add('hide');
      screenshot.current.addEventListener('pointerdown', startDrag);
      handleImage('');
      form.resetFields();
    } else {
      form.setFieldsValue({
        title: campaign.info.title,
        version: campaign.info.version || 1, 
        reward: campaign.info.reward, 
        description: campaign.info.description, 
      });
    }
  }, [campaign]);

  function startDrag(ev) {
    window.addEventListener('pointerup', stopDrag);
    screenshot.current.addEventListener('pointermove', moveDrag);
    marquee.current.classList.remove('hide');
    startX = ev.layerX;
    startY = ev.layerY;
  }

  const removeRectangle = index => {
    rectangles.current.splice(index, 1);
    redraw();
    forceUpdate();
  };

  function stopDrag(ev) {
    const index = rectangles.current.findIndex(
      el =>
        el.x === marqueeRect.x &&
        el.y === marqueeRect.y &&
        el.width === marqueeRect.width &&
        el.height === marqueeRect.height
    );
    if (index < 0) {
      marquee.current.classList.add('hide');
      window.removeEventListener('pointerup', stopDrag);
      screenshot.current.removeEventListener('pointermove', moveDrag);
      if (
        ev.target.id === 'img-document' &&
        marqueeRect.width &&
        marqueeRect.height &&
        rectangles.current.length < colors.length
      ) {
        const newRectangle = Object.assign({}, marqueeRect);
        rectangles.current.push(newRectangle);
        redraw();
        forceUpdate();
      }
      marqueeRect.x = 0;
      marqueeRect.y = 0;
      marqueeRect.width = 0;
      marqueeRect.height = 0;
    }
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
    drawRect(marquee.current, marqueeRect);
  }

  function redraw() {
    boxes.current.innerHTML = '';
    rectangles.current.forEach((data, index) => {
      boxes.current.appendChild(drawRect(
        document.createElementNS("http://www.w3.org/2000/svg", 'rect'), data, index
      ));
    });
  }

  function drawRect(rect, data, index) {
    const { x, y, width, height } = data; //
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    if (index) {
      rect.setAttributeNS(null, 'style', `fill:${colors[index]}`);
    }
    return rect;
  }

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

  async function dataUrlToFile(dataUrl){
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], 'image.png', { type: 'image/png' });
  }

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = info => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        handleImage(imageUrl);
      });
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const selectBatch = selectedBatch => {
    handleTask(selectedBatch);
    handleTaskDetails(true);
  };

  const save = async () => {
    handleSending(true);
    const values = await form.validateFields();
    const {title, description, reward, version} = values;
    if (title?.length && description?.length && reward?.length && version?.length) {
      if (image.length) {
        if (rectangles.current.length) {
          let status = true;
          rectangles.current.map(rect => {
            if (!rect.name.length) {
              status = false;
            }
          });
          if (status) {
            const newImage = await takeScreenshot(screenshot.current);
            const newFile = await dataUrlToFile(newImage);
            const data = rectangles.current.map((rect, index) => (
              {
                name: rect.name,
                color: colors[index],
              }
            ));
            const info = new FormData();
            info.append('id', user.id);
            info.append('title', title);
            info.append('description', description);
            info.append('reward', reward);
            info.append('version', version);
            info.append('data', JSON.stringify(data));
            info.append('example_task', newFile);
            const response = await dispatch(createCampaign(info));
            if (response.status === 'success') {
              await renewInfo();
              message.success('Campign created successfully');
            } else {
              message.error('Try again later');
            }
          } else {
            Modal.error({title: 'Label without name',  content: 'Add a name to every label created'});
          }
        } else {
          Modal.error({title: 'Empty labels',  content: 'There aren\'t labels created'});
        }
      } else {
        Modal.error({title: 'Empty image',  content: 'There is no image to label'});
      }
    } else {
      Modal.error({title: 'Incomplete fields',  content: 'Complete every field to continue'});
    }
    handleSending(false);
  };

  return (
    <div className={styles.editor}>
      <h1 className={styles.title}>
        {isNew ? 'New Campaign' : 'Detail'}
      </h1>
      <div className={styles.form}>
        <Form
          name="campaign"
          initialValues={{ remember: true }}
          form={form}
          onFinish={save}
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
                <Input disabled={!isNew} size="large" className={styles.input} />
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
                <Input size="large" disabled={!isNew} className={styles.input} />
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
                <Input size="large" disabled={!isNew} className={styles.input} />
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
                <TextArea disabled={!isNew} rows={4} className={styles.textArea} />
              </Form.Item>
            </Col>
          </Row>
          {isNew && (
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
          )}
          <Row>
            <Col span={24}>
              <div className={cx(styles.previewImage, {hide: image.length || !isNew})}>
                <span className="material-icons-round">
                  collections
                </span>
              </div>
              {isNew ? (
                <div className={cx(styles.imageWrapper, {[styles.noMarginBottom]: !image.length})}>
                  <div className={styles.image} id="screenshot" ref={screenshot}>
                    <img id="img-document" src={image} alt="" draggable={false} />
                    <svg id="draw" className={styles.draw} xmlns="http://www.w3.org/2000/svg">
                      <rect id="marquee" ref={marquee} className={styles.marquee} x="0" y="0" width="0" height="0" />
                      <g id="boxes" ref={boxes} className={styles.boxes}></g>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className={cx(styles.imageWrapper, {[styles.noMarginBottom]: false})}>
                  <img src={campaign.info.example_task.image_url} alt="" className={styles.createdPhoto} />
                </div>
              )}
              {isNew && (
                <div className={cx(styles.feedbackWrap, {[styles.noMarginTop]: !image.length})}>
                  <Feedback className={styles.feedbackIcon} />
                  <span className={styles.feedback}>
                    Draw a rectangle over the part of the image you need get the information
                    to and we will automatically categorize the data of your images.
                  </span>
                </div>
              )}
            </Col>
          </Row>
          {isNew ? (
            <Row>
              <Col span={24}>
                <div className={styles.inputs}>
                  {rectangles.current.map((input, index) => (
                    <div key={index.toString()} className={styles.inputImage}>
                      <div className={styles.colorPreview} style={{backgroundColor: colors[index]}} />
                      <Input
                        size="large"
                        className={cx(styles.input, styles.inputList)}
                        value={rectangles.current[index].name}
                        onChange={e => {
                          rectangles.current[index].name = e.target.value;
                          forceUpdate();
                        }}
                      />
                      <div className={styles.remove} onClick={() => removeRectangle(index)}>
                        <span className="material-icons-round">
                          remove
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={24}>
                <span className={styles.batchesTitle}>
                  {`Batches (${campaign.batches.length})`}
                </span>
                <div className={styles.inputs}>
                  {campaign.batches.map(batch => (
                    <div key={batch.batch_id.toString()} className={styles.inputImage}>
                      {/* <div className={styles.colorPreview} style={{backgroundColor: colors[index]}} /> */}
                      <div className={styles.squareBatch} />
                      <div className={styles.progressWrap}>
                        <div
                          className={styles.progress}
                          style={{width: `${(batch.tasks_done * 100) / batch.num_tasks}%`}}
                        />
                        <span className={styles.progressNumber}>
                          {`${batch.tasks_done} / ${batch.num_tasks} left`}
                        </span>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => selectBatch(batch)}
                        className={cx(styles.submit, styles.tasks)}>
                        Task Results
                        <span className="material-icons-round">
                          query_stats
                        </span>
                      </Button>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          )}
          <Row>
            <Col span={24}>
                {isNew ? (
                  <Form.Item className={styles.itemSubmit}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={sending}
                      className={styles.submit}>
                      Create Campaign
                      <span className="material-icons-round">
                        add
                      </span>
                    </Button>
                  </Form.Item>
                ) : (
                  <div className={styles.itemSubmit}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => handleCreateBatch(true)}
                      className={styles.submit}>
                      Create Batch
                      <span className="material-icons-round">
                        add
                      </span>
                    </Button>
                  </div>
                )}
            </Col>
          </Row>
        </Form>
        <Drawer
          destroyOnClose
          closable={false}
          onClose={() => handleCreateBatch(false)}
          className={styles.drawer}
          width={650}
          visible={createBatch}>
          <CreateBatch close={() => handleCreateBatch(false)} campaign={campaign} renewInfo={renewInfo} />
        </Drawer>
        <Drawer
          destroyOnClose
          closable={false}
          onClose={() => handleTaskDetails(false)}
          className={styles.drawer}
          width={650}
          visible={taskDetails}>
          <TaskDetails close={() => handleTaskDetails(false)} campaign={campaign} task={task} />
        </Drawer>
      </div>
    </div>
  );
};

export default Editor;
