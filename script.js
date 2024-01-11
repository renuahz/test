// Функція для перевірки перекриття
function checkOverlap(newBlock, existingBlocks, blockMargin) {
  for (const block of existingBlocks) {
    if (
      newBlock.right >= block.left - blockMargin &&
      newBlock.left <= block.right + blockMargin &&
      newBlock.bottom >= block.top - blockMargin &&
      newBlock.top <= block.bottom + blockMargin
    ) {
      return true; // Є перекриття з існуючим блоком
    }
  }
  return false; // Немає перекриття з існуючими блоками
}

// Функція для розрахунку площі блока
function calculateBlockArea(block) {
  return block.width * block.height;
}

// Функція для розрахунку коефіцієнта корисного використання простору
function calculateFullness(containerArea, blockCoordinates) {
  let totalBlockArea = 0;

  for (const block of blockCoordinates) {
    totalBlockArea += calculateBlockArea(block);
  }

  const emptySpace = containerArea - totalBlockArea;
  const fullness = 1 - (emptySpace / containerArea);

  return fullness;
}

// Функція для генерації блоків
const blockMargin = 0;
function generateBlocks(containerWidth, containerHeight, numBlocks) {
  const blockCoordinates = [];
  const maxAttempts = 100;

  for (let i = 0; i < numBlocks; i++) {
    const width = Math.floor(Math.random() * 100) + 50;
    const height = Math.floor(Math.random() * 100) + 50;

    let newBlock;
    let attempts = 0;
    do {
      newBlock = {
        top: Math.floor(Math.random() * (containerHeight - height)),
        left: Math.floor(Math.random() * (containerWidth - width)),
        right: 0,
        bottom: 0,
        initialOrder: i + 1,
        width: width,
        height: height,
      };

      newBlock.right = newBlock.left + width;
      newBlock.bottom = newBlock.top + height;

      attempts++;
    } while (checkOverlap(newBlock, blockCoordinates, blockMargin) && attempts < maxAttempts);

    blockCoordinates.push(newBlock);
  }

  return blockCoordinates;
}

// Функція для визначення оптимального розміщення блоків
function optimizeBlockPlacement(containerWidth, containerHeight, blockCoordinates) {
  blockCoordinates.sort((a, b) => b.width * b.height - a.width * a.height); // Сортування за спаданням площі блоків

  const optimizedCoordinates = [];
  let currentTop = 0;
  let currentLeft = 0;

  blockCoordinates.forEach((block) => {
    const div = document.createElement('div');
    div.className = 'block';
    div.style.width = block.width + 'px';
    div.style.height = block.height + 'px';
    div.style.top = currentTop + 'px';
    div.style.left = currentLeft + 'px';
    div.textContent = block.initialOrder;

    const randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    div.style.backgroundColor = randomColor;

    optimizedCoordinates.push({
      top: currentTop,
      left: currentLeft,
      width: block.width,
      height: block.height,
      initialOrder: block.initialOrder,
      color: randomColor,
    });

    currentLeft += block.width + blockMargin;
    if (currentLeft + block.width > containerWidth) {
      currentTop += block.height + blockMargin;
      currentLeft = 0;
    }

    document.getElementById('container').appendChild(div);
  });

  return optimizedCoordinates;
}

// Генеруємо блоки
const containerWidth = 500, containerHeight = 500;
const blockCoordinates = generateBlocks(containerWidth, containerHeight, 10);

// Сортуємо блоки за зменшенням площі
const sortedBlocks = blockCoordinates.slice().sort((a, b) => b.width * b.height - a.width * a.height);

// Визначаємо оптимальне розміщення блоків та отримуємо коефіцієнт корисного використання простору
const optimizedCoordinates = optimizeBlockPlacement(containerWidth, containerHeight, sortedBlocks);
const containerArea = containerWidth * containerHeight;
const fullness = calculateFullness(containerArea, optimizedCoordinates);

// Оновлюємо UI
document.getElementById('fullness').textContent = `Fullness: ${Math.round(fullness * 100)}`;
