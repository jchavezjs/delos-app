const $ = document.querySelector.bind(document);

/**
 * Collection of rectangles defining user generated regions
 */
const rectangles = [];

// DOM elements
const $screenshot = $('#screenshot');
const $draw = $('#draw');
const $marquee = $('#marquee');
const $boxes = $('#boxes');

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
};

$marquee.classList.add('hide');
$screenshot.addEventListener('pointerdown', startDrag);

// Add Input

var addid = 0;

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

function renameInput(id) {
    var text = document.createElement('div');
    var item = document.getElementById(`i_${id}`);
    var new_name = item.value.toLowerCase();

    item.setAttribute("name", new_name);

    console.log(item);
}

//

function startDrag(ev) {
	// middle button delete rect
	if (ev.button === 2) {
  	const rect = hitTest(ev.layerX, ev.layerY);
    if (rect) {
        removeInput(rect.id);
    	rectangles.splice(rectangles.indexOf(rect), 1);
        redraw();
    }
  	return;
  }
	window.addEventListener('pointerup', stopDrag);
  $screenshot.addEventListener('pointermove', moveDrag);
  $marquee.classList.remove('hide');
  startX = ev.layerX;
  startY = ev.layerY;
//   drawRect($marquee, startX, startY, 0, 0);
}

function stopDrag(ev) {
    $marquee.classList.add('hide');
    window.removeEventListener('pointerup', stopDrag);
    $screenshot.removeEventListener('pointermove', moveDrag);
    if (ev.target === $screenshot && marqueeRect.width && marqueeRect.height) {
        // Assign ID to rectangle
        marqueeRect.id = addid;

        rectangles.push(Object.assign({}, marqueeRect));

        // Add Input
        addInput();

        // Re Draw Rectangles
        redraw();
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
	const { x, y, width, height } = data;
	rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    return rect;
}
