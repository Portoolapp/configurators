// Initialize Sketchfab Viewer
const iframe = document.getElementById("api-frame");
const uid = "fad0f5c31798432299874ef814606886"; // Replace with your model's UID

let api;
const version = "1.12.1";
let base = {};
let _nodes;
let baseSash = [];
let baseLock1 = [];
let baseLock2 = [];
let baseLocks = {};
let locksId = [];
// Initialize Sketchfab client and load the model
const client = new Sketchfab(version, iframe);
let interiorColor = "white";
let exteriorColor = "black";
let handleColor = undefined;
let myMaterials = [];
const sliderItemId = 304;
const zoomOut = 0.6;
/*!SECTION

(3) [-2.7174170659391397, -0.05261466489717182, 2.0827442408772687]
VM3582:3 
(3) [0.00003166594505310538, 0.017710406076908443, 1.5019633000373842]

undefined
VM3712:2 (3) [0.00984113250497559, 2.79028723950023, 1.7007123991535738]
VM3712:3 (3) [0.00003166594505310538, 0.017710406076908443, 1.5019633000373842]
*/

const cameraSettings = {
  laptop: {
    interior: {
      position: [0.21293992496851537, -1.138738450816036, 0.3535439458435225],
      target: [0.17749937616082234, 0.02174988872000365, 0.3074988338632685],
    },
    intermediate: {
      position: [-1.3537542778272345, -0.61055808028151832, 0.0902761359143873],
      target: [0.17749937616082234, 0.02174988872000365, 0.3074988338632685],
    },
    exterior: {
      position: [0.192030785195712795, 1.1773109324582653, 0.3260634451459333],
      target: [0.17749937616082234, 0.02174988872000365, 0.3074988338632685],
    },
  },
  tablet: {
    interior: {
      position: [0.202030785195712795, -1.246484646947164, 0.30163477636609553],
      target: [
        0.17749937616082234, 0.02174988872000365, 0.3074988338632685,
      ],
    },
    intermediate: {
      position: [-2.3537542778272345, 0.031055808028151832, 1.0902761359143873],
      target: [
        0.17749937616082234, 0.02174988872000365, 0.3074988338632685,
      ],
    },
    exterior: {
      position: [0.212030785195712795, 1.3773109324582653, 0.277606344514593],
      target: [
        0.17749937616082234, 0.02174988872000365, 0.3074988338632685,
      ],
    },
  },
  phone: {
    interior: {
      position: [0.1568213272777293, -1.34484646947164, 0.32636609553],
      target: [
        0.17749937616082234, 0.02174988872000365, 0.3074988338632685,
      ],
    },
    intermediate: {
      position: [-2.1997344205780345, 0.024289219006150442, 0.8306011014937053],
      target: [
        0.17749937616082234, 0.02174988872000365, 0.3074988338632685,
      ],
    },
    exterior: {
      position: [0.2193887696818398, 1.4324168412785936, 0.3450235159705],
      target: [
        0.17749937616082234, 0.02174988872000365, 0.3074988338632685,
      ],
    },
  },
};

const materialChannels = {
  AOPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  AlbedoPBR: { type: "color" },
  Anisotropy: { type: "number", min: 0, max: 1, step: 0.01 },
  BumpMap: { type: "file" },
  CavityPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  ClearCoat: { type: "number", min: 0, max: 1, step: 0.01 },
  ClearCoatNormalMap: { type: "file" },
  ClearCoatRoughness: { type: "number", min: 0, max: 1, step: 0.01 },
  DiffuseColor: { type: "color" },
  DiffuseIntensity: { type: "number", min: 0, max: 1, step: 0.01 },
  DiffusePBR: { type: "color" },
  Displacement: { type: "file" },
  EmitColor: { type: "color" },
  GlossinessPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  Matcap: { type: "file" },
  MetalnessPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  NormalMap: { type: "file" },
  Opacity: { type: "number", min: 0, max: 1, step: 0.01 },
  RoughnessPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  SpecularColor: { type: "color" },
  SpecularF0: { type: "number", min: 0, max: 1, step: 0.01 },
  SpecularHardness: { type: "number", min: 0, max: 1, step: 0.01 },
  SpecularPBR: { type: "number", min: 0, max: 1, step: 0.01 },
  SubsurfaceScattering: { type: "number", min: 0, max: 1, step: 0.01 },
  SubsurfaceTranslucency: { type: "number", min: 0, max: 1, step: 0.01 },
};

const myMaterialsv2 = [
  { name: "Interior", channels: {} }, // Example material
];

// Function to show the correct page and hide others
function navigateTo(page) {
  // Hide all pages
  const pages = document.querySelectorAll(".page1, .page2, .page3, .page4");
  pages.forEach((p) => (p.style.display = "none"));

  // Show the selected page
  document.querySelector(`.${page}`).style.display = "block";
}

// Set initial page to show (e.g., page1)
navigateTo("page1");

document
  .querySelector(".page1 .nav-item.left")
  .addEventListener("click", () => navigateTo("page4")); // Going left from page1 to page4

document
  .querySelector(".page1 .nav-item.right")
  .addEventListener("click", () => navigateTo("page2")); // Going right from page1 to page2

// Page 2: Exterior Color navigation
document
  .querySelector(".page2 .nav-item.left")
  .addEventListener("click", () => navigateTo("page1")); // Going left from page2 to page1

document
  .querySelector(".page2 .nav-item.right")
  .addEventListener("click", () => navigateTo("page3")); // Going right from page2 to page3

// Page 3: Hardware Color navigation
document
  .querySelector(".page3 .nav-item.left")
  .addEventListener("click", () => navigateTo("page2")); // Going left from page3 to page2

document
  .querySelector(".page3 .nav-item.right")
  .addEventListener("click", () => navigateTo("page4")); // Going right from page3 to page4

// Page 4: Grille Pattern navigation
document
  .querySelector(".page4 .nav-item.left")
  .addEventListener("click", () => navigateTo("page3")); // Going left from page4 to page3

document
  .querySelector(".page4 .nav-item.right")
  .addEventListener("click", () => navigateTo("page1")); // Going right from page4 to page1

const interiorColors = {
  white: "#f3f4f5",
  black: "#000000",
  brown: "#4b453e", // Added brown
  tan: "#c4b296", // Added tan
  morningskygray: "#c2bebb", // Added morning sky gray
};
const exteriorColors = {
  white: "#f3f4f5",
  black: "#000000",
  brown: "#4b453e", // Added brown
  tan: "#c4b296", // Added tan
  morningkkygray: "#c2bebb", // Added morning sky gray
};
const colorCombinations = {
  white: ["black", "brown", "tan", "morningskygray"], // White interior can have Black or Bronze exterior
  black: ["black"], // Black interior can only have Black exterior
  brown: ["brown"], // Brown interior can only have Brown exterior
  tan: ["tan"], // Tan interior can only have Tan exterior
  morningskygray: ["morningskygray"], // mMrningskygray interior can only have mMrningskygray exterior
};

function hexToRgbArray(hex) {
  // Remove "#" if present
  console.log(`hextoRGBArray input : ${hex}`);
  hex = hex.replace(/^#/, "");

  // Check for valid 6-character hex color
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16) / 255; // Convert to [0, 1]
    const g = parseInt(hex.slice(2, 4), 16) / 255; // Convert to [0, 1]
    const b = parseInt(hex.slice(4, 6), 16) / 255; // Convert to [0, 1]
    return [r, g, b]; // Return an array [r, g, b] with normalized values
  } else {
    return null; // Invalid hex code
  }
}

function setColor(materialName, hexcode) {
  var materialToChange;
  console.log("length", myMaterials.length, myMaterials);
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name == materialName) {
      console.log("Checking for match: " +  materialName);
      materialToChange = m;
    }
  }
  console.log("Material to Change: " + materialToChange);
  materialToChange.channels.AlbedoPBR.factor = 1;
  materialToChange.channels.AlbedoPBR.enable = true;
  materialToChange.channels.AlbedoPBR.color = hexToRgbArray(hexcode);

  // materialToChange.channels.DiffuseColor.factor = 1;
  // materialToChange.channels.DiffuseColor.color = hexToRgbArray(hexcode);
  // console.log("Final material:" + materialToChange);
  api.setMaterial(materialToChange);
}

const grillTypes = {
  prairie: [998, 1574],
  traditional: [1135, 1711],
};

const handleID = 412;

function onSuccess(apiInstance) {
  api = apiInstance;
  api.start();
  api.addEventListener("viewerready", function () {
    console.log("Viewer is absolutely ready");
    onModelLoaded(api);
  });
}

function onError() {
  console.log("Viewer error");
}
// Initialize the Sketchfab viewer
client.init(uid, {
  success: onSuccess,
  error: onError,
  autostart: 1,
  preload: 1,
  animation_autoplay: 0,
  annotation: 0,
  annotation_tooltip_visible: 0,
  annotations_visible: 0,
  ui_animations: 0,
  ui_controls: 0,
  ui_general_controls: 0,
  ui_infos: 0,
  ui_stop: 0,
  ui_inspector: 0,
  ui_watermark_link: 0,
  ui_watermark: 0,
  ui_ar: 0,
  ui_help: 0,
  ui_settings: 0,
  ui_vr: 0,
  ui_fullscreen: 0,
  transparent: 1,
  ui_color: "222222",
});

// Log all parts in the model (node map)
function logAllParts(api) {
  api.getNodeMap(function (err, nodes) {
    if (!err) {
      window.console.log(nodes);
      Object.values(nodes).forEach((node) => {
        console.log(
          `InstanceID : ${node.instanceID}, Part Type: ${node.type}, Name: ${node.name}`
        );
      });
    }
    _nodes = nodes;
  });
}

function onModelLoaded(api) {
  console.log("Model has been loaded");
  console.log(`Device is ${deviceType()}`);
  logAllParts(api);
  getSliderWorldCoordinates(api);
  //  Get the animation

  hideAllGrills();
  // Show the default grill (Traditional, for instance)
  showGrillType("traditional");
  logAllMaterials(api);

  if (deviceType() == "tablet") {
    console.log("Setting tab to tab interior");
    api.setCameraLookAt(
      cameraSettings.tablet.interior.position,
      cameraSettings.tablet.interior.target,
      2,
      (err) => {
        if (!err) {
          console.log("Camera moved successfully!");
        } else {
          console.error("Error setting camera:", err);
        }
      }
    );
  }
  setTimeout(initialInteriorAndExterior, 2000);
  initializeMaterialEditor();
}

function getSliderWorldCoordinates(api) {
  const nodeInstanceID = sliderItemId; // The instance ID for the primary slider
  // Get the world matrix of the node
  api.getMatrix(nodeInstanceID, function (err, matrix) {
    if (!err) {
      // Extract the X, Y, Z coordinates from the world matrix
      const x = matrix.world[12]; // X coordinate
      const y = matrix.world[13]; // Y coordinate
      const z = matrix.world[14]; // Z coordinate

      // Store them in the baseSash array
      baseSash = [x, y, z];

      console.log("Slider World Coordinates: ", baseSash);
    } else {
      // console.error("Error getting matrix for instance ID 217:", err);
    }
  });

  // also get the handles base values
  locksId.forEach((id) => {
    api.getMatrix(id, function (err, matrix) {
      if (!err) {
        // Extract the X, Y, Z coordinates from the world matrix
        const x = matrix.world[12]; // X coordinate
        const y = matrix.world[13]; // Y coordinate
        const z = matrix.world[14]; // Z coordinate

        // Store them in the baseLocks object with the ID as the key
        baseLocks[id] = [x, y, z];

        console.log(`Lock World Coordinates for ID ${id}:`, baseLocks[id]);
      } else {
        console.error(`Error getting matrix for instance ID ${id}:`, err);
      }
    });
  });
}

function showGrillType(grillType) {
  // First, hide all grill types
  hideAllGrills();

  // Now, show the selected grill type
  switch (grillType) {
    case "prairie":
      grillTypes.prairie.forEach((instanceId) => {
        api.show(instanceId, function (err) {
          if (!err) {
            console.log(`Showed node ${instanceId}`);
          }
        });
      });
      break;
    case "traditional":
      grillTypes.traditional.forEach((instanceId) => {
        api.show(instanceId, function (err) {
          if (!err) {
            console.log(`Showed node ${instanceId}`);
          }
        });
      });
      break;
    case "none":
      // hideAllGrills();
      console.log("Hidden all grils");
  }
}

function hideAllGrills() {
  // Hide all grill nodes
  Object.values(grillTypes).forEach((grillArray) => {
    grillArray.forEach((instanceId) => {
      api.hide(instanceId, function (err) {
        if (!err) {
          console.log(`Hid node ${instanceId}`);
        }
      });
    });
  });
}

// Open Upper & Lower Window
function openAnimation(api) {
  var speed = 0.5;
  api.setCycleMode('one', function () {
    api.setSpeed(speed, function (err) {
      api.play();
    });
  });
}

// Handle toggle
function toggleHandler() {
  const toggleButton = document.getElementById("toggle-button");
  let toggleFlag = toggleButton.getAttribute('toggle-flag');
  if (toggleFlag == "0") {
    document.getElementById("toggle-on").style.display = "none";
    document.getElementById("toggle-off").style.display = "block";
    openAnimation(api)
    toggleFlag = "1";
  } else {
    api.getAnimations(function (err, animations) {
      if (!err) {
        if (animations && animations.length > 0) {
          api.seekTo(0);
          api.pause();
        }
      }
    });
    document.getElementById("toggle-on").style.display = "block";
    document.getElementById("toggle-off").style.display = "none";
    toggleFlag = "0";
  }
  toggleButton.setAttribute('toggle-flag', toggleFlag);
}

// Handle the toggle of the open & close
document.getElementById('toggle-button').addEventListener('click', toggleHandler);

document.querySelectorAll(".interior-color").forEach((element) => {
  element.addEventListener("click", interiorColorSelectHandler);
});
function initialInteriorAndExterior() {
  // Select the button with the class "interior-color" and data-color="white"
  const button = document.querySelector('.interior-color[data-color="white"]');

  // Simulate a click event on the button
  button.click();

  // setColor("Exterior.002", interiorColors["black"]);
  setColor("Interior.002", interiorColors["white"]);
}

function interiorColorSelectHandler(event) {
  focusExterior();
  console.log(`Button pressed : ${event.target}`);
  const selectedColor = event.target.getAttribute("data-color");
  console.log(`Selected color : ${selectedColor}`);

  interiorColor = selectedColor;

  // Capitalize the first letter of the selected color
  const capitalizedColor = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);

  document.querySelector(".interior-selected-color").textContent = capitalizedColor;
  const colorValue = event.target.getAttribute("data-value");
  document.querySelectorAll(".interior-selected-color").forEach((element) => {
    element.textContent = capitalizedColor;
    element.style.color = colorValue
  });

  // Remove the 'selected' class from all color buttons
  document.querySelectorAll(".interior-color").forEach((button) => {
    button.classList.remove("selected");
  });

  // Add the 'selected' class to the clicked color button
  event.target.classList.add("selected");
  setColor("Interior.002", interiorColors[interiorColor]);
  // if (interiorColor === "white") {
  //   // showAllExteriorColors();
  //   console.log("No need to disable any Exterior colors");
  //   updateExteriorColorOptions(interiorColor);
  // } else {
  //   // Otherwise, show only the exterior colors that match the interior color
  //   updateExteriorColorOptions(interiorColor);
  //   setColor("Exterior", interiorColors[interiorColor]);
  // }
  // TODO : update selections
  updateExteriorColorOptionsv2(interiorColor);
}

function showAllExteriorColors() {
  // Show all exterior color circles
  const exteriorColorCircles = document.querySelectorAll(".exterior-color");
  exteriorColorCircles.forEach((circle) => {
    circle.style.display = "inline-block";
  });
}
document.querySelectorAll(".exterior-color").forEach((element) => {
  element.addEventListener("click", exteriorColorSelectHandler);
});

function updateExteriorColorOptions(selectedInteriorColor) {
  document.querySelectorAll(".exterior-color").forEach((button) => {
    button.classList.remove("blocked-overlay");
  });
  const exteriorColorCircles = document.querySelectorAll(".exterior-color");
  if (selectedInteriorColor == "white") {
    exteriorColorCircles.forEach((circle) => {
      const exteriorColor = circle.getAttribute("data-color");
      circle.style.opacity = "1";
      circle.style.pointerEvents = "auto";
      circle.style.filter = "none";
    });
    document.querySelectorAll(".exterior-color").forEach((button) => {
      button.classList.remove("selected");
    });
  } else {
    exteriorColorCircles.forEach((circle) => {
      const exteriorColor = circle.getAttribute("data-color");
      if (selectedInteriorColor === exteriorColor) {
        console.log(
          `For interior: ${selectedInteriorColor} and exterior: ${exteriorColor}, the decision is the same`
        );
        // Enable the matching exterior color
        document.querySelectorAll(".exterior-color").forEach((button) => {
          button.classList.remove("selected");
        });

        // Add the 'selected' class to the clicked color button

        document.querySelectorAll(".exterior-color").forEach((button) => {
          console.log("Inside the query selector");
          console.log(
            `data-color attr= ${button.getAttribute(
              "data-color"
            )}  and selectedInternalColor = ${selectedInteriorColor}`
          );
          if (button.getAttribute("data-color") === selectedInteriorColor) {
            button.classList.add("selected");
          } else {
            button.classList.add("blocked-overlay");
          }
        });

        console.log("Current focus statement executed ? ");
        circle.style.opacity = "1";
        circle.style.pointerEvents = "auto";
        circle.style.filter = "none"; // Reset any disabled styles
      } else {
        // Disable the non-matching exterior colors
        // circle.style.opacity = "0.5"; // Visual indication of being disabled
        circle.style.pointerEvents = "none"; // Makes it unclickable
        // circle.style.filter = "grayscale(100%)"; // Optional visual cue
        // circle.classList.add("blocked-overlay");
      }
    });
  }
}

function updateExteriorColorOptionsv2(selectedInteriorColor) {
  console.log(`Selected Interior Color: ${selectedInteriorColor}`);

  // Remove any 'blocked-overlay' class from all exterior color buttons
  document.querySelectorAll(".exterior-color").forEach((button) => {
    button.classList.remove("blocked-overlay");
  });

  document.querySelectorAll(".exterior-color").forEach((button) => {
    button.classList.remove("selected");
  });

  const exteriorColorCircles = document.querySelectorAll(".exterior-color");

  // Check for matching exterior color options based on the selected interior color
  if (colorCombinations[selectedInteriorColor]) {
    console.log(
      `Available exterior colors for "${selectedInteriorColor}": ${colorCombinations[selectedInteriorColor]}`
    );

    // Flag to check if we've auto-selected the first exterior option
    let autoSelected = false;

    exteriorColorCircles.forEach((circle) => {
      const exteriorColor = circle.getAttribute("data-color");
      console.log(
        `Inside Updateexteriorcoloroptionsv2 , exterior Color = ${exteriorColor}`
      );
      // Check if the exterior color is valid for the selected interior color
      if (colorCombinations[selectedInteriorColor].includes(exteriorColor)) {
        console.log(`Enabling exterior color: ${exteriorColor}`);

        // If we haven't auto-selected yet, select the first valid color automatically
        if (!autoSelected) {
          circle.classList.add("selected");
          setColor("Exterior.002", interiorColors[exteriorColor]);
          console.log(`Auto-selected exterior color: ${exteriorColor}`);
          autoSelected = true; // Set flag so we don't auto-select again
        } else {
          // Dont block the other permissible colors
          console.log(
            `The color ${exteriorColor} is not selected but also not blocked`
          );
        }
      } else {
        // Disable non-matching exterior color options
        console.log(`Disabling exterior color: ${exteriorColor}`);
        circle.classList.add("blocked-overlay");
        console.log(`Blocking exterior color: ${exteriorColor}`);
      }
    });
  } else {
    console.log(
      `No valid exterior options for interior color: ${selectedInteriorColor}`
    );
  }
}

function exteriorColorSelectHandler(event) {
  focusInterior();
  const selectedColor = event.target.getAttribute("data-color");
  exteriorColor = selectedColor;
  const capitalizedColor = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
  document.querySelectorAll(".exterior-selected-color").forEach((element) => {
    element.textContent = capitalizedColor;

    // Get the data-value attribute and set it as the color
    const colorValue = event.target.getAttribute("data-value");
    element.style.color = colorValue;
  });



  console.log(`Selected color : ${selectedColor}`);
  document.querySelectorAll(".exterior-color").forEach((button) => {
    button.classList.remove("selected");
  });

  // Add the 'selected' class to the clicked color button
  event.target.classList.add("selected");
  exteriorColor = selectedColor;
  setColor("Exterior.002", interiorColors[exteriorColor]);
}

// Function to update available exterior color options based on the selected interior colo

// Handle Grill Type Selection
const grillButtons = document.querySelectorAll(".grill-button");

grillButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedGrill = e.target.id;
    console.log(`Grill type selected: ${selectedGrill}`);
    updateGrillButtonStyles(selectedGrill);
    showGrillType(selectedGrill);
  });
});

// Update button styles based on selected grill type
function updateGrillButtonStyles(selectedGrill) {
  grillButtons.forEach((button) => {
    if (button.id === selectedGrill) {
      button.classList.add("bg-blue-500", "text-white");
      button.classList.remove("bg-gray-300", "text-gray-700");
    } else {
      button.classList.add("bg-gray-300", "text-gray-700");
      button.classList.remove("bg-blue-500", "text-white");
    }
  });
}

// Handle Lock (Handle) Color Selection
// const lockButtons = document.querySelectorAll(".lock-button");

function logAllMaterials(api) {
  // Get the list of all materials in the scene
  api.getMaterialList(function (err, materials) {
    if (err) {
      console.error("Error getting materials:", err);
      return;
    }

    // Log each material's details
    myMaterials = materials;
    console.log('myMaterials', myMaterials);
    materials.forEach((material, index) => {
      console.log(`Material ${index}:`, material);
    });
  });
}

// Function to handle color selection and apply material customization
document.querySelectorAll(".lock-button, .hardware-color").forEach((button) => {
  button.addEventListener("click", (event) => {
    const selectedColor = event.target.getAttribute("data-color");
    const hex = event.target.getAttribute("hex");

    const capitalizedColor = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
    document.querySelectorAll(".hardware-selected-color").forEach((element) => {
      element.textContent = capitalizedColor;

      if (hex === "#f0eeef") {
        element.style.color = "#d4d4d4";
      } else {
        element.style.color = hex;
      }
    });

    document.querySelectorAll(".hardware-color").forEach((button) => {
      button.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked color button
    event.target.classList.add("selected");
    focusExterior();
    if (hex) {
      // If the element has a hex attribute, create a customColor object
      const customColor = {
        hex: hex,
        name: selectedColor,
        metalness: parseFloat(event.target.getAttribute("metalness")) || 0,
        glossiness: parseFloat(event.target.getAttribute("glossiness")) || 0,
        roughness: parseFloat(event.target.getAttribute("roughness")) || 0,
        specular: parseFloat(event.target.getAttribute("specular")) || 0,
      };
      // Pass the customColor object to applyGeneralColor
      applyGeneralColor(customColor);
    } else {
      // Fallback to the original switch-case logic for buttons without a hex attribute
      switch (selectedColor) {
        case "bright-brass":
          applyBrightBrassColor();
          break;
        case "morning-sky-gray":
          applyMorningSkyGrayColor();
          break;
        case "oil-rubbed-bronze":
          applyOilRubbedBronzeColor();
          break;
        case "satin-nickel":
          applySatinNickelColor();
          break;
        case "white":
          applyWhiteColor();
          break;
        default:
          console.log("Unknown color selected");
      }
    }
  });
});

// Function for "Bright Brass" color
// Function to apply Bright Brass customizations
function applyBrightBrassColor() {
  console.log("Applying Bright Brass Customization");

  // Loop through the materials to find "lock"
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "lock.002") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  // If the material is found, customize it
  if (materialToChange) {
    // Set DiffuseColor (Base Color)
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      234 / 255,
      221 / 255,
      112 / 255,
    ]; // RGB to [0, 1] range for Bright Brass

    // Set GlossinessPBR (shininess)
    materialToChange.channels.GlossinessPBR.factor = 0.85; // High gloss for Bright Brass

    // Set MetalnessPBR (reflectivity)
    materialToChange.channels.MetalnessPBR.factor = 0.9; // High metalness for a metallic look

    // Optionally, you could adjust other channels as well, e.g., Specular, Roughness, etc.
    materialToChange.channels.RoughnessPBR.factor = 0.2; // Low roughness for a smooth, shiny surface

    // Optionally, adjust SpecularPBR or other channels for more realistic material effects
    materialToChange.channels.SpecularPBR.factor = 0.9; // High specularity to simulate shiny surface

    // Apply the changes using the Sketchfab API
    api.setMaterial(materialToChange, function () {
      console.log("Bright Brass material updated successfully");
    });
  } else {
    console.log("lock not found");
  }
}

// Function for "Morning Sky Gray" color
function applyMorningSkyGrayColor() {
  console.log("Applying Morning Sky Gray Customization");

  // Loop through the materials to find "lock"
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "lock.002") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  // If the material is found, customize it
  if (materialToChange) {
    // Set AlbedoPBR (Base Color)
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      188 / 255, // R value for Morning Sky Gray
      188 / 255, // G value for Morning Sky Gray
      188 / 255, // B value for Morning Sky Gray
    ]; // RGB to [0, 1] range
    // materialToChange.channels.AlbedoPBR.color = hexToRgbArray(
    //   interiorColors["morning-sky-gray"]
    // );

    // Set GlossinessPBR (shininess) - low gloss for matte plastic
    materialToChange.channels.GlossinessPBR.factor = 0.25; // Matte finish

    // Set MetalnessPBR (reflectivity) - low metalness for a matte plastic
    materialToChange.channels.MetalnessPBR.factor = 0.3; // Slight metallic, but still mainly plastic

    // Set RoughnessPBR (smoothness) - high roughness for matte finish
    materialToChange.channels.RoughnessPBR.factor = 0.75; // Rough surface for matte plastic

    // Set SpecularPBR (reflectivity) - low specularity for matte finish
    materialToChange.channels.SpecularPBR.factor = 0.3; // Lower specularity to simulate matte

    // Apply the changes using the Sketchfab API
    api.setMaterial(materialToChange, function () {
      console.log("Morning Sky Gray material updated successfully");
    });
  } else {
    console.log("lock not found");
  }
}

// Function for "Oil Rubbed Bronze" color
function applyOilRubbedBronzeColor() {
  console.log("Applying Oil Rubbed Bronze Customization");

  // Loop through the materials to find "lock"
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "lock.002") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  // If the material is found, customize it
  if (materialToChange) {
    // Set AlbedoPBR (Base Color)
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      59 / 255, // R value for Oil Rubbed Bronze
      56 / 255, // G value for Oil Rubbed Bronze
      51 / 255, // B value for Oil Rubbed Bronze
    ]; // RGB to [0, 1] range

    // Set GlossinessPBR (shininess) - slightly reflective, but still matte
    materialToChange.channels.GlossinessPBR.factor = 0.4; // Moderate gloss for slightly reflective finish

    // Set MetalnessPBR (reflectivity) - high metalness for aged bronze effect
    materialToChange.channels.MetalnessPBR.factor = 0.7; // High metalness to reflect the bronze nature

    // Set RoughnessPBR (smoothness) - matte but slightly smooth
    materialToChange.channels.RoughnessPBR.factor = 0.55; // Slight roughness for matte bronze look

    // Set SpecularPBR (reflectivity) - moderate specularity for subtle reflections
    materialToChange.channels.SpecularPBR.factor = 0.5; // Moderate specularity to simulate slight reflections

    // Apply the changes using the Sketchfab API
    api.setMaterial(materialToChange, function () {
      console.log("Oil Rubbed Bronze material updated successfully");
    });
  } else {
    console.log("lock not found");
  }
}

// Function for "Satin Nickel" color
function applyGeneralColor(customColor) {
  console.log(`custom color in apply general ${customColor}`);
  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "lock.002") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }
  let rgb = hexToRgbArray(customColor.hex);
  if (materialToChange) {
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = rgb;

    if (customColor?.glossiness !== undefined) {
      materialToChange.channels.GlossinessPBR.factor = customColor.glossiness;
    }
    if (customColor?.metalness !== undefined) {
      materialToChange.channels.MetalnessPBR.factor = customColor.metalness;
    }
    if (customColor?.roughness !== undefined) {
      materialToChange.channels.RoughnessPBR.factor = customColor.roughness;
    }
    if (customColor?.specular !== undefined) {
      materialToChange.channels.SpecularPBR.factor = customColor.specular;
    }

    api.setMaterial(materialToChange, function () {
      console.log(`${customColor.name} material updated successfully`);
    });
  } else {
    console.log("lock not found");
  }
}
function applySatinNickelColor() {
  console.log("Applying Satin Nickel Customization");

  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "lock.002") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  if (materialToChange) {
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      210 / 255, // Light silver base
      210 / 255,
      205 / 255,
    ];

    materialToChange.channels.EmitColor = {
      enable: true,
      color: [220 / 255, 220 / 255, 220 / 255], // Soft silver glow
      factor: 0.2, // Subtle emission, not overpowering
    };

    materialToChange.channels.GlossinessPBR.factor = 0.95; // Higher glossiness
    materialToChange.channels.MetalnessPBR.factor = 1; // Fully metallic
    materialToChange.channels.RoughnessPBR.factor = 0.05; // Very smooth and shiny
    materialToChange.channels.SpecularPBR.factor = 0.9; // High specular reflection

    api.setMaterial(materialToChange, function () {
      console.log("Satin Nickel material updated successfully");
    });
  } else {
    console.log("lock not found");
  }
}

// Function for "White" color
function applyWhiteColor() {
  console.log("Applying White Customization");

  var materialToChange;
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name === "lock.002") {
      materialToChange = m;
      console.log(`Material to Change has been found: ${m.name}`);
      break;
    }
  }

  if (materialToChange) {
    materialToChange.channels.AlbedoPBR.factor = 1;
    materialToChange.channels.AlbedoPBR.enable = true;
    materialToChange.channels.AlbedoPBR.color = [
      238 / 255,
      235 / 255,
      236 / 255,
    ];

    materialToChange.channels.GlossinessPBR.factor = 0.3; // Less glossy, more matte
    materialToChange.channels.MetalnessPBR.factor = 0.1; // Low reflectivity
    materialToChange.channels.RoughnessPBR.factor = 0.75; // More rough for matte finish
    materialToChange.channels.SpecularPBR.factor = 0.4; // Less specular for a more diffused reflection

    api.setMaterial(materialToChange, function () {
      console.log("White material updated successfully");
    });
  } else {
    console.log("lock not found");
  }
}

document.querySelectorAll(".grille-option").forEach((option) => {
  option.addEventListener("click", (event) => {
    // Get the value of the data-pattern attribute
    const pattern = option.getAttribute("data-pattern");
    const capitalizedColor = pattern.charAt(0).toUpperCase() + pattern.slice(1);

    document.querySelectorAll(".grille-selected-color").forEach((element) => {
      element.textContent = capitalizedColor;
    });
    showGrillType(pattern);

    // Remove the 'selected' class from all options
    document.querySelectorAll(".grille-option").forEach((option) => {
      option.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked option
    option.classList.add("selected");

    // Log the selected pattern
    console.log(`Selected grille pattern: ${pattern}`);
  });
});

document.querySelectorAll(".nav-item.center").forEach((element) => {
  element.addEventListener("click", (event) => {

    const selectedColor = "white";
    const extColor = "black";
    console.log(`Selected color : ${selectedColor}`);

    interiorColor = selectedColor;

    // Remove the 'selected' class from all color buttons
    document.querySelectorAll(".interior-color").forEach((button) => {
      button.classList.remove("selected");
    });

    setColor("Interior.002", interiorColors[interiorColor]);
    updateExteriorColorOptions(selectedColor);
    setColor("Exterior.002", interiorColors[extColor]);
    document.querySelectorAll(".hardware-color").forEach((button) => {
      button.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked color button
    applyWhiteColor();
    const pattern = "traditional";
    hideAllGrills();
    showGrillType(pattern);

    // Remove the 'selected' class from all options
    document.querySelectorAll(".grille-option").forEach((option) => {
      option.classList.remove("selected");
    });

    api.recenterCamera(function (err) {
      if (!err) {
        console.log("Camera recentered");
      }
    });
  });
});

function deviceType() {
  const width = window.innerWidth;

  if (width <= 768) {
    console.log("phone");
    return "phone";
  } else if (width > 768 && width <= 1200) {
    console.log("tablet");
    return "tablet";
  } else {
    console.log("laptop");
    return "laptop";
  }
}

function isNearPosition(currentPos, targetPos, threshold = 0.05) {
  return (
    Math.abs(currentPos[0] - targetPos[0]) < threshold &&
    Math.abs(currentPos[1] - targetPos[1]) < threshold &&
    Math.abs(currentPos[2] - targetPos[2]) < threshold
  );
}
// function focusExterior() {
//   // Get the current device type (laptop or tablet)
//   const device = deviceType(); // Returns either 'laptop' or 'tablet'

//   // Get the camera settings for the current device
//   const exterior = cameraSettings[device].exterior;
//   const interior = cameraSettings[device].interior;
//   const intermediate = cameraSettings[device].intermediate;

//   // Adjust the camera position to be closer for a larger view
//   const closerExteriorPosition = [
//     exterior.position[0] * zoomOut, // Adjust X position
//     exterior.position[1] * zoomOut, // Adjust Y position
//     exterior.position[2] * zoomOut  // Adjust Z position
//   ];

//   // Get the current camera position and target
//   api.getCameraLookAt(function (err, camera) {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     const currentPosition = camera.position;

//     // Check if the current camera is near the interior position
//     if (isNearPosition(currentPosition, interior.position)) {
//       console.log(
//         "Dest:Exterior Initial:Near Interior Path:Intermediate needed"
//       );
//       setCamera(intermediate.position, intermediate.target, 1);
//       setTimeout(() => setCamera(closerExteriorPosition, exterior.target, 1), 700);
//     } else {
//       setCamera(closerExteriorPosition, exterior.target, 2);
//     }
//   });
// }

function focusExterior() {
  // Get the current device type (laptop or tablet)
  const device = deviceType(); // Returns either 'laptop' or 'tablet'

  // Get the camera settings for the current device
  const exterior = cameraSettings[device].exterior;
  const interior = cameraSettings[device].interior;
  const intermediate = cameraSettings[device].intermediate;

  // Get the current camera position and target
  api.getCameraLookAt(function (err, camera) {
    if (err) {
      console.error(err);
      return;
    }

    const currentPosition = camera.position;

    // Check if the current camera is near the interior position
    if (isNearPosition(currentPosition, interior.position)) {
      console.log(
        "Dest:Exterior Initial:Near Interior Path:Intermediate needed"
      );
      setCamera(intermediate.position, intermediate.target, 1);
      setTimeout(delayedExterior, 700);
    } else {
      setCamera(exterior.position, exterior.target, 2);
    }
  });
}

function delayedExterior() {
  const exterior = cameraSettings[deviceType()].exterior;
  setCamera(exterior.position, exterior.target, 1);
}

// Function to focus on the interior, with checks for intermediate position
function focusInterior() {
  // Get the current device type (laptop or tablet)
  const device = deviceType(); // Returns either 'laptop' or 'tablet'

  // Get the camera settings for the current device
  const interior = cameraSettings[device].interior;
  const exterior = cameraSettings[device].exterior;
  const intermediate = cameraSettings[device].intermediate;

  // Get the current camera position and target
  api.getCameraLookAt(function (err, camera) {
    if (err) {
      console.error(err);
      return;
    }

    const currentPosition = camera.position;

    // Check if the current camera is near the exterior position
    if (isNearPosition(currentPosition, exterior.position)) {
      console.log(
        "Dest:Interior Initial:Near Exterior Path:Intermediate needed"
      );
      setCamera(intermediate.position, intermediate.target, 1);
      setTimeout(delayedInterior, 700);
    } else {
      setCamera(interior.position, interior.target, 2);
    }
  });
}
function delayedInterior() {
  const interior = cameraSettings[deviceType()].interior;
  setCamera(interior.position, interior.target, 1);
}

function setCamera(position, target, duration = 2, callback) {
  api.setCameraLookAt(position, target, duration, function (err) {
    if (err) {
      console.error("Error setting camera:", err);
    }
    if (callback) {
      callback();
    }
  });
}


// Hook up buttons to camera settings
// document.getElementById("interiorBtn").addEventListener("click", function () {
//   const interior = cameraSettings.laptop.interior;
//   setCamera(interior.position, interior.target);
// });

// document.getElementById("exteriorBtn").addEventListener("click", function () {
//   const exterior = cameraSettings.laptop.exterior;
//   setCamera(exterior.position, exterior.target);
// });

// document
//   .getElementById("intermediateBtn")
//   .addEventListener("click", function () {
//     const intermediate = cameraSettings.laptop.intermediate;
//     setCamera(intermediate.position, intermediate.target);
//   });

document.getElementById("setCamera").addEventListener("click", function () {
  // Retrieve input values
  const position = [
    parseFloat(document.getElementById("cameraX").value) || 0,
    parseFloat(document.getElementById("cameraY").value) || 0,
    parseFloat(document.getElementById("cameraZ").value) || 0,
  ];
  const target = [
    parseFloat(document.getElementById("targetX").value) || 0,
    parseFloat(document.getElementById("targetY").value) || 0,
    parseFloat(document.getElementById("targetZ").value) || 0,
  ];

  // Call the API to set the camera position
  api.setCameraLookAt(position, target, 2, function (err) {
    if (!err) {
      console.log("Camera moved to:", position, "Targeting:", target);
    } else {
      console.error("Error setting camera:", err);
    }
  });
});

// Event Listener for "Get Position" Button
// document.getElementById("getPosition").addEventListener("click", function () {
//   // Call the API to get the current camera position and target
//   api.getCameraLookAt(function (err, camera) {
//     if (!err) {
//       console.log("Current Camera Position:", camera.position);
//       console.log("Current Camera Target:", camera.target);
//     } else {
//       console.error("Error getting camera position:", err);
//     }
//   });
// });

function createMaterialInput(name, options) {
  const container = document.createElement("div");
  container.classList.add("material-input");

  const label = document.createElement("label");
  label.textContent = name;

  const input = document.createElement("input");
  input.name = name;

  if (options.type === "number" || options.type === "range") {
    input.type = "range";
    input.min = options.min;
    input.max = options.max;
    input.step = options.step;
  } else {
    input.type = options.type;
  }

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

function initializeMaterialEditor() {
  const container = document.getElementById("input-container");
  Object.entries(materialChannels).forEach(([name, options]) => {
    const inputElement = createMaterialInput(name, options);

    // Add event listener to automatically update the material
    inputElement.addEventListener("input", (event) => {
      updateMaterial(name, event.target.value, options.type);
    });

    container.appendChild(inputElement);
  });
}

// Function to update material based on changes
function updateMaterial(channelName, value, type) {
  console.log(
    `Update Material for channel:${channelName} val:${value} type:${type}`
  );
  let materialToChange;

  // Find the material you want to update
  for (var i = 0; i < myMaterials.length; i++) {
    var m = myMaterials[i];
    if (m.name == "Interior") {
      materialToChange = m;
      console.log(`Material to Change has been found`);
    }
  }

  if (!materialToChange) {
    console.error("Material not found!");
    return;
  }

  // Update the material's channel based on input type
  if (type === "color") {
    console.log("Type = color , value = ");
    console.log(value);
    materialToChange.channels[channelName] = {
      factor: 1,
      enable: true,
      color: hexToRgbArray(value),
      // color: value,
    };
  } else if (type === "number") {
    materialToChange.channels[channelName] = {
      factor: parseFloat(value),
      enable: true,
    };
  }

  // Apply the changes to the model
  api.setMaterial(materialToChange);
}

function parseHexToRgbArray(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Assuming `api` is the Sketchfab viewer API object available in the scope
document.getElementById("getCamera").addEventListener("click", function () {
  api.getCameraLookAt(function (err, camera) {
    if (err) {
      console.error("Error fetching camera data:", err);
      return;
    }
    console.log("Camera Position:", camera.position);
    console.log("Camera Target:", camera.target);
  });
});

document
  .getElementById("recenterCamera")
  .addEventListener("click", function () {
    api.recenterCamera(function (err) {
      if (err) {
        console.error("Error recentering camera:", err);
        return;
      }
      console.log("Camera recentered");
    });
  });

document.getElementById("setCamera").addEventListener("click", function () {
  const position = [
    parseFloat(document.getElementById("cameraPosX").value) || 0,
    parseFloat(document.getElementById("cameraPosY").value) || 0,
    parseFloat(document.getElementById("cameraPosZ").value) || 0,
  ];
  const target = [
    parseFloat(document.getElementById("cameraTargetX").value) || 0,
    parseFloat(document.getElementById("cameraTargetY").value) || 0,
    parseFloat(document.getElementById("cameraTargetZ").value) || 0,
  ];

  api.setCameraLookAt(position, target, 2, function (err) {
    if (err) {
      console.error("Error setting camera:", err);
      return;
    }
    console.log("Camera position and target set to:", position, target);
  });
});
