import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'                                                import {FFmpeg} from '@ffmpeg/ffmpeg'

// Version string for vendor files (likely for cache busting)
const vender_version = '1663764183'
GlobalWorkerOptions.workerSrc = pdfjsWorker
// Default vertical resolution for output video
let y_size = 720
// Default input file name
let input_file = 'result.pdf'
// Log text variable to accumulate ffmpeg logs
let log_text = ''

// Get references to HTML elements
const format = document.getElementById("format") // Output format select element
const interval = document.getElementById("interval") // Page interval select element
// Function to generate output file name based on selected format
const output_file = () => `result.${format.value}`
// Function to generate output MIME type based on selected format
const output_mime = () => `video/${format.value}`
// Function to determine ffmpeg quality settings based on quality select element
/*
const quality = () => {
  switch(document.getElementById("quality").value) {
    case 'low':
      // return [] // Low quality settings (empty array means default)
      return ['-crf', '25', '-b:v', '500000']
    case 'best':
      // Best quality settings: high CRF, bitrate, quality, and slow speed
      return ['-crf', '4', '-b:v', '5000000', '-quality', 'best', '-speed', '4']
    default:
      // Normal quality settings: high CRF and bitrate
      return ['-crf', '4', '-b:v', '5000000']
  }
}
*/

const quality = () => {
  switch(document.getElementById("quality").value) {
    case 'low':
      return ['-crf', '28'] // Lower Quality, smaller file size
    case 'best':
      return ['-crf', '18'] // High Quality, moderate file size
    default: // Normal quality
      return ['-crf', '23'] // Medium Quality (default)
  }                                                                                                          }                                                                                                            
// Function to generate download file name based on input file, resolution, interval, and format
// const dl_filename = () => `${input_file.replace(/\.[^.]+$/, '')}.${y_size}p.t${interval.value}.${format.value}`                                                                                                        const dl_filename = () => `${input_file.replace(/\.[^.]+$/, '')}.${format.value}`

// !!! original>
/*
// Function to determine video encoding arguments based on selected format
 const encode_args = () => format.value == 'mp4'? ['-c:v', 'libx264', '-r', '30']: ['-c:v', 'libvpx', ...quality(),]

// Function to determine framerate string for ffmpeg based on selected interval
const framerate = () => {
  switch(interval.value) {
    case '1': return '1' // 1 frame per second
    case '2': return '1/2' // 1 frame per 2 seconds
  }
}
// Function to generate complete ffmpeg command arguments
const ffmpeg_args = () => ['-y', // Overwrite output files without asking
  '-pattern_type', 'glob', // Enable glob pattern matching for input files
  '-r', framerate(), // Set input framerate
  '-i', 'page*.png', // Input files are page PNG images
  ...encode_args(), // Video encoding arguments (format and quality dependent)
  '-pix_fmt', 'yuv420p', // Pixel format for compatibility
  output_file() // Output file name
]
*/
// !!!/>


// !!!>

// Function to determine video encoding arguments based on selected format
const encode_args = () =>
  format.value == 'mp4' ? ['-c:v', 'libx264', '-r', '30', ...quality(),] : ['-c:v', 'libvpx', ...quality(),]

// Function to determine framerate string for ffmpeg based on selected interval
const framerate = () => {
  switch(interval.value) {
    case '1': return '1' // 1 frame per second
    case '2': return '1/2' // 1 frame per 2 seconds
    case '3': return '1/5' // 1 frame per 5 seconds
  }
}

// Function to generate complete ffmpeg command arguments
const ffmpeg_args = () => ['-y', // Overwrite output files without asking
  '-pattern_type', 'glob', // Enable glob pattern matching for input files
  '-r', framerate(), // Set input framerate
  '-i', 'page*.png', // Input files are page PNG images
  ...encode_args(), // Video encoding arguments (format and quality dependent)
  '-pix_fmt', 'yuv420p', // Pixel format for compatibility
  output_file() // Output file name
]

// !!!/>


// !!!
/*
// Update framerate to 1 FPS input for the 5-second option
const framerate = () => {
  switch(interval.value) {
    case '1': return '1';
    case '2': return '1/2';
    case '3': return '1'; // Input: 1 frame per second
  }
}

// Modify encode_args to handle output framerate for 5-second case
const encode_args = () => {
  if (interval.value === '3') {
    // For 5-second option, force output to 0.2 FPS (1/5)
    return format.value === 'mp4'
      ? ['-c:v', 'libx264', '-r', '0.2']
      : ['-c:v', 'libvpx', ...quality(), '-r', '0.2'];
  } else {
    // Original behavior for other intervals
    return format.value === 'mp4'
      ? ['-c:v', 'libx264', '-r', '30']
      : ['-c:v', 'libvpx', ...quality()];
  }
}

// Keep ffmpeg_args unchanged
const ffmpeg_args = () => [
  '-y',
  '-pattern_type', 'glob',
  '-r', framerate(),
  '-i', 'page*.png',
  ...encode_args(),
  '-pix_fmt', 'yuv420p',
  output_file()
]
*/
// !!!/>






// !!!
/*
// Update framerate function to return 0.2 (1/5 fps)
const framerate = () => {
  switch(interval.value) {
    case '1': return '1';
    case '2': return '1/2';
    case '3': return '0.2'; // 1 frame every 5 seconds
  }
}

// Keep ffmpeg_args simple (no filters needed)
const ffmpeg_args = () => [
  '-y',
  '-pattern_type', 'glob',
  '-r', framerate(),
  '-i', 'page*.png',
  ...encode_args(),
  '-pix_fmt', 'yuv420p',
  output_file()
]
*/
// !!!/>


// !!!
/*
// Update framerate function
const framerate = () => {
  switch(interval.value) {
    case '1': return '1';
    case '2': return '1/2';
    case '3': return '1'; // 1 frame per second, but stretched via filter
  }
}

// Modify ffmpeg_args to include the setpts filter for interval '3'
const ffmpeg_args = () => {
  const baseArgs = [
    '-y',
    '-pattern_type', 'glob',
    '-r', framerate(),
    '-i', 'page*.png',
    ...encode_args(),
    '-pix_fmt', 'yuv420p',
    output_file()
  ];
  if (interval.value === '3') {
    // Insert the video filter before the codec arguments
    return [
      '-y',
      '-pattern_type', 'glob',
      '-r', framerate(),
      '-i', 'page*.png',
      '-vf', 'setpts=PTS*5', // Stretch each frame to 5 seconds
      ...encode_args(),
      '-pix_fmt', 'yuv420p',
      output_file()
    ];
  }
  return baseArgs;
}
*/
// !!!/>


// Get references to more HTML elements
const r = document.getElementById("resolution") // Resolution select element
const f = document.getElementById("file") // File input element
const q = document.getElementById("quality") // Quality select element
const ires = document.getElementById("input_resolution") // Input resolution display element
const ores = document.getElementById("output_resolution") // Output resolution display element
const runBtn = document.getElementById("run") // Run button element
const progress = document.getElementById("progress") // Progress bar element
const logtext = document.getElementById("logtext") // Log textarea element

// Variables to store PDF document and related properties
let pdf = null; // PDF document object
let scale = 1; // Scaling factor for PDF rendering
let width = 0; // PDF width
let height = 0; // PDF height

// Function to calculate the greatest common divisor (GCD) using Euclidean algorithm
function gcd(x, y) {
  while(y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// Function to format resolution as "WxH(W:H)" string
function format_res(x,y){
  const c = gcd(Math.round(x), Math.round(y)) // Calculate GCD for aspect ratio
  return `${x}x${y}(${x/c}:${y/c})` // Format resolution string
}

// Function to calculate scaling factor to fit PDF within 16:9 aspect ratio
function innerFit(x, y, h){
  if(x/y > 16/9) {
    // If PDF is wider than 16:9
    const w = (16/9)*h // Calculate width to maintain 16:9 aspect ratio with given height
    return w/x // Scaling factor based on width
  } else {
    // If PDF is narrower or equal to 16:9
    return h/y // Scaling factor based on height
  }
}

// Asynchronous function to check PDF file and extract resolution
async function check_pdf(file_node){
  let file = null;
  if(file_node.files instanceof FileList){
    if(file_node.files.length > 0) {
      file = file_node.files[0] // Get the first file from the file input
    }
  }
  if (file === null){
    pdf = null // Reset PDF object if no file selected
    ires.innerText = 'N/A' // Clear input resolution display
    return
  }
  input_file = file.name // Store input file name
  log_text = `[pdf] ${file.name}\n` // Initialize log with input file name
  logtext.value = log_text // Update log textarea
  const fileData = await readFileAsync(file) // Read file data as ArrayBuffer
  // Parse PDF file using pdf.js
  pdf = await getDocument({
    cMapPacked: true, // Enable CMap packed format
    cMapUrl: `/v${vender_version}/cmaps/`, // URL for CMap resources
    data: fileData, // PDF file data
  }).promise

  // Check resolution of the first page
  const page = await pdf.getPage(1) // Get the first page
  const viewport = page.getViewport({scale: 1}) // Get viewport at scale 1
  width = viewport.width // Get page width
  height = viewport.height // Get page height
  ires.innerText = format_res(width, height) // Display input resolution

  // Initialize progress bar
  progress.value = 0
  progress.innerText = ''
  runBtn.removeAttribute('disabled') // Enable the run button
}

// Asynchronous function to calculate output resolution based on user selection
async function calc_resolusion() {
  if (pdf === null) {
    scale = null // Reset scale if no PDF loaded
    ores.innerText = `N/A` // Clear output resolution display
    return
  }
  switch(r.value){
  case "original": scale = 1; break // Original size, scale = 1
  case "double": scale = 2; break // Double size, scale = 2
  case "720":
  case "1080":
  case "1440":
  case "2160":
    // Fit to specified vertical resolution (720p, 1080p, etc.)
    const num = parseInt(r.value, 10) // Parse resolution value as integer
    if (isNaN(num)) {
      scale = 1 // Default to scale 1 if parsing fails
    } else {
      scale = innerFit(width, height, num) // Calculate scaling factor to fit height
    }
    break
  default:
    scale = 1 // Default scale
  }
  y_size = Math.round(height*scale) // Calculate output vertical resolution
  ores.innerText = format_res(width*scale, height*scale) // Display output resolution
}

// Asynchronous function to read file as ArrayBuffer using FileReader API
function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader() // Create FileReader object
    reader.onload = () => {
      resolve(reader.result) // Resolve promise with ArrayBuffer on load
    }
    reader.onerror = reject // Reject promise on error
    reader.readAsArrayBuffer(file) // Read file as ArrayBuffer
  })
}

// Asynchronous function to render a PDF page to PNG data using Canvas
async function pdfToPNG(page, canvas) {
  // Render PDF page to canvas
  const viewport = page.getViewport({ scale: scale }) // Get viewport with calculated scale
  canvas.height = viewport.height // Set canvas height
  canvas.width = viewport.width // Set canvas width
  const context = canvas.getContext('2d') // Get 2D rendering context
  var task = page.render({ // Render PDF page on canvas
    canvasContext: context, // Canvas context
    viewport: viewport, // Viewport settings
  })
  await task.promise // Wait for rendering task to complete

  // Convert canvas content to PNG data (Uint8Array)
  const base64 = canvas.toDataURL('image/png') // Get canvas data as base64 encoded PNG
  return Uint8Array.from(Array.prototype.map.call(atob(base64.split(',')[1]), x => x.charCodeAt(0))) // Decode base64 and convert to Uint8Array
}

// Asynchronous function to render all PDF pages to PNG files using ffmpeg.wasm's virtual file system
async function pdfToPNGList(ffmpeg) {
  if(pdf === null) {
    return null // Return null if no PDF loaded
  }
  // Render pages
  const numPages = pdf.numPages // Get number of pages in PDF
  const canvas = document.createElement('canvas') // Create a canvas element
  for(let i = 0; i < numPages; i++){ // Loop through each page
    const page = await pdf.getPage(i+1) // Get PDF page
    const data = await pdfToPNG(page, canvas) // Render page to PNG data
    const num = `00${i}`.slice(-3) // Format page number with leading zeros
    await ffmpeg.writeFile(`page${num}.png`, data) // Write PNG data to ffmpeg.wasm virtual file system
  }
  canvas.remove() // Remove canvas element from DOM
  return numPages // Return number of pages processed
}

// Function to create a download link for the output video data
function downloadLink(data){
  const blob = new Blob([data], {type: output_mime()}) // Create Blob from video data with correct MIME type
  const url = window.URL.createObjectURL(blob) // Create URL for the Blob
  const a = document.createElement('a') // Create a link element
  a.href = url // Set link URL
  a.download = dl_filename() // Set download file name
  a.click() // Programmatically click the link to trigger download
  a.remove() // Remove the link element from DOM
}

// Initialize ffmpeg.wasm when the page loads
const ffmpeg = new FFmpeg() // Create FFmpeg instance
// Event handler for ffmpeg log messages
ffmpeg.on("log", ({type, message}) => {
  log_text += `[${type}] ${message}\n` // Append log message to log text
  logtext.value = log_text // Update log textarea
  logtext.scroll(0, logtext.scrollHeight); // Scroll log textarea to bottom
})
// Event handler for ffmpeg progress updates
ffmpeg.on("progress", (d) => {
  log_text += `[progress] ${(d.progress * 100).toFixed(2)}% done\n` // Append progress message to log text
  logtext.value = log_text // Update log textarea
  logtext.scroll(0, logtext.scrollHeight); // Scroll log textarea to bottom
  progress.value = d.progress; // Update progress bar value
  progress.innerText = `${(d.progress * 100).toFixed(2)}% done` // Update progress bar text
})
// Load ffmpeg.wasm core
const loadwait = ffmpeg.load({
  log: true, // Enable ffmpeg logging
  coreURL: `/v1694948356/ffmpeg-core.js`, // URL to ffmpeg-core.js file
})

// Asynchronous function to run the PDF to WebM/MP4 conversion process
async function run() {
  // Disable form elements during processing
  r.setAttribute('disabled', '')
  f.setAttribute('disabled', '')
  q.setAttribute('disabled', '')
  format.setAttribute('disabled', '')
  runBtn.setAttribute('disabled', '')
  // Wait for ffmpeg.wasm to load
  progress.innerText = '' // Clear progress text
  progress.removeAttribute('value') // Remove progress bar value to show indeterminate state
  await loadwait // Wait for ffmpeg.load() promise to resolve
  const numPages = await pdfToPNGList(ffmpeg) // Render PDF pages to PNG files and get page count
  await ffmpeg.exec(ffmpeg_args()) // Execute ffmpeg command with generated arguments
  const result = await ffmpeg.readFile(output_file()) // Read output video file from ffmpeg.wasm virtual file system
  downloadLink(result) // Trigger download of the output video
  // Cleanup ffmpeg.wasm virtual file system
  ffmpeg.deleteFile(output_file()) // Delete output video file
  for(let i = 0; i < numPages; i++){ // Loop through page PNG files
    const num = `00${i}`.slice(-3) // Format page number
    ffmpeg.deleteFile(`page${num}.png`) // Delete page PNG file
  }
  // Re-enable form elements after processing
  r.removeAttribute('disabled')
  f.removeAttribute('disabled')
  q.removeAttribute('disabled')
  format.removeAttribute('disabled')
  runBtn.removeAttribute('disabled')
}

// Event listener for file input change event
f.addEventListener("change", e => check_pdf(e.target).then(calc_resolusion))
// Event listener for resolution select change event
r.addEventListener("change", calc_resolusion)
// Disable run button initially
runBtn.setAttribute('disabled', '')
// Event listener for run button click event
runBtn.addEventListener('click', _ => run())
