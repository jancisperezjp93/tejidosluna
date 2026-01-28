const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const gridSizeSelect = document.getElementById('gridSize');
const colorModeSelect = document.getElementById('colorMode');
const showNumbersCheckbox = document.getElementById('showNumbers');
const cellSizeInput = document.getElementById('cellSize');
const generateBtn = document.getElementById('generateBtn');
const canvas = document.getElementById('patternCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

let img = null;
const tempCanvas = document.createElement('canvas');
const tempCtx = tempCanvas.getContext('2d');

function updatePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        img = new Image();
        img.onload = () => {
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            tempCtx.drawImage(img, 0, 0);
            const recommendedSize = Math.min(50, Math.max(10, Math.floor(Math.sqrt(img.width*img.height)/20)));
            gridSizeSelect.value = recommendedSize;
            generatePattern();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) updatePreview(file);
});

[gridSizeSelect, colorModeSelect, showNumbersCheckbox, cellSizeInput].forEach(el=>{
    el.addEventListener('change', ()=>{ if(img) generatePattern(); });
});

generateBtn.addEventListener('click', ()=>{ if(img) generatePattern(); });

function generatePattern(){
    const gridSize=parseInt(gridSizeSelect.value);
    const colorMode=colorModeSelect.value;
    const showNumbers=showNumbersCheckbox.checked;
    const cellSize=parseInt(cellSizeInput.value);
    const offset=showNumbers?30:0;

    canvas.width = gridSize*cellSize + offset;
    canvas.height = gridSize*cellSize + offset;
    ctx.fillStyle='#FFF';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const imgData=tempCtx.getImageData(0,0,img.width,img.height);
    const imgWidth=img.width;
    const imgHeight=img.height;

    for(let y=0;y<gridSize;y++){
        for(let x=0;x<gridSize;x++){
            const imgX=Math.floor((x/gridSize)*imgWidth);
            const imgY=Math.floor((y/gridSize)*imgHeight);
            const idx=(imgY*imgWidth+imgX)*4;
            const r=imgData.data[idx], g=imgData.data[idx+1], b=imgData.data[idx+2];
            const color=colorMode==='bw'? ((r+g+b)/3>128?'#FFF':'#000') : `rgb(${r},${g},${b})`;
            ctx.fillStyle=color;
            ctx.fillRect(x*cellSize+offset,y*cellSize+offset,cellSize,cellSize);
            ctx.strokeStyle='#FFD6D6';
            ctx.strokeRect(x*cellSize+offset,y*cellSize+offset,cellSize,cellSize);
        }
    }

    if(showNumbers){
        ctx.fillStyle='#333';
        ctx.font=`${Math.min(14,cellSize-2)}px Arial`;
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        for(let i=0;i<gridSize;i++){
            const xPos=i*cellSize+offset+cellSize/2;
            const yPos=offset/2;
            ctx.fillText(i+1,xPos,yPos);
            const ySide=i*cellSize+offset+cellSize/2;
            const xSide=offset/2;
            ctx.fillText(i+1,xSide,ySide);
        }
    }
}

downloadBtn.addEventListener('click', ()=>{
    if(!img){ alert('Genera un patrón primero'); return; }
    const link=document.createElement('a');
    link.download='patron.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
});
