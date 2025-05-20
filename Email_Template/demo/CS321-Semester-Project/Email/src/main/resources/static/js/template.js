document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove 'active' class from all tabs and content
      document.querySelector('.tab.active').classList.remove('active');
      document.querySelector('.content.active').classList.remove('active');

      // Add 'active' class to the clicked tab and corresponding content
      tab.classList.add('active');
      const contentId = tab.getAttribute('data-content');
      document.getElementById(contentId).classList.add('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');

    header.addEventListener('click', () => {
      // Close all other accordion items
      accordionItems.forEach(i => {
        const content = i.querySelector('.accordion-content');
        if (content.classList.contains('active') && i !== item) {
          content.classList.remove('active');
        }
      });

      // Toggle current accordion item
      const content = item.querySelector('.accordion-content');
      content.classList.toggle('active');
    });
  });
});

// Insert [INPUT] Placeholder
document.getElementById('input-button').addEventListener('mousedown', (event) => {
  event.preventDefault();

  const activeField = document.activeElement;

  if (activeField && (activeField.tagName === 'TEXTAREA' || activeField.tagName === 'INPUT')) {
    const cursorPos = activeField.selectionStart || 0;
    const textBefore = activeField.value.substring(0, cursorPos);
    const textAfter = activeField.value.substring(cursorPos);
    activeField.value = `${textBefore}[INPUT]${textAfter}`;
    activeField.focus();
    activeField.selectionStart = activeField.selectionEnd = cursorPos + 7;
  } else {
    alert('Click inside a field where you want to insert [INPUT].');
  }
});

// Publish Template
document.getElementById('publish-button').addEventListener('click', () => {
  alert('Template published!');
});

// Generate Preview
document.getElementById('preview-button').addEventListener('click', () => {
  const subject = document.getElementById('subject').value || '[No Subject]';
  const greeting = document.getElementById('greeting').value || '[No Greeting]';
  const body = document.getElementById('body').value || '[No Body]';
  const closing = document.getElementById('closing').value || '[No Closing]';
  const signature = document.getElementById('signature').value || '[No Signature]';

  const preview = `
Subject: ${subject}

${greeting}

${body}

${closing}

${signature}
  `;


  document.getElementById('email-preview').textContent = preview
});

// explore templates

document.addEventListener('DOMContentLoaded', () => {
  const folderList = document.getElementById('folder-list');
  const templateList = document.getElementById('template-list');

  // Data structure to hold folder contents
  const folders = {
  };

  const templates = [
  ];

  function addDefaultFolders(){
    const request = new Request("http://localhost:8080/get-all-folders", {
      method: "GET",
    });

    let response = fetch(request)
      .then(response => response.json())
      .then(data => {
        let counter = 0;
        data.forEach((folder) =>{
          if(folder.uid == localStorage.getItem("ID")){
            counter += 1
          }
        })

        if(counter < 2){
          const request1 = new Request("http://localhost:8080/create-folder", {
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ name: "My Templates", tid: "", uid: localStorage.getItem('ID') })
          });

          fetch(request1)

          const request2 = new Request("http://localhost:8080/create-folder", {
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ name: "Saved Templates", tid: "", uid: localStorage.getItem('ID') })
          });

          fetch(request2)
          .then()
          .then(data =>{
            populateFolders()
            updateFolderAccordion()
            updateMyTemplates()
          })
          
        }
        
      })
  }
  addDefaultFolders()

  function updateMyTemplates(){
    const request1 = new Request("http://localhost:8080/get-all-templates", {
      method: "GET",
    });

    let response1 = fetch(request1)
      .then(response => response.json())
      .then(data => {
        data.forEach((temp) => {
          let template = temp
          if(template.uid == localStorage.getItem("ID") && template.tid != 0){
            let alreadyIn = false;
            const request2 = new Request("http://localhost:8080/get-folder/My Templates/" + localStorage.getItem("ID"), {
              method: "GET",
            });
        
            let response2 = fetch(request2)
              .then(response => response.json())
              .then(data => {
                data.forEach((templato) => {
                  if(templato.tid == template.tid){
                    alreadyIn = true;
                  }
                })

                if(!alreadyIn){
                  const request3 = new Request("http://localhost:8080/add-to-folder", {
                    headers: {
                      "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({ name: "My Templates", tid: template.tid, uid: localStorage.getItem('ID') })
                  });
      
                  let response3 = fetch(request3)
                    .then(response => response.json)
                    .then(data => {
                      populateFolders()
                      updateFolderAccordion()
                    })
                }
              })

        

          }
        })
      })

  }
  updateMyTemplates()

  // Publish Template
  document.getElementById("publish-button").addEventListener("click", () => {
    const subject = document.getElementById('subject').value;
    const greeting = document.getElementById('greeting').value;
    const body = document.getElementById('body').value;
    const closing = document.getElementById('closing').value;
    const signature = document.getElementById('signature').value;
    let publicly = document.getElementById("make-public").checked
    const uid = localStorage.getItem("ID")
    const request = new Request("http://localhost:8080/create", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ subject: subject, introduction: greeting, action: body, closing: closing, signature: signature, publicly: publicly, uid: uid })
    });

    let response = fetch(request)
      .then(response => response.json())
      .then(data => {
        document.getElementById("template-list").innerHTML = ''
        populateTemplates()

        document.querySelector('.tab.active').classList.remove('active');
        document.querySelector('.content.active').classList.remove('active');

        // Add 'active' class to the clicked tab and corresponding content
        tab4.classList.add('active');
        const contentId = tab4.getAttribute('data-content');
        document.getElementById(contentId).classList.add('active');
        updateMyTemplates()
      })
      .catch(function () {
      });
  })


  // Populate Templates
  const populateTemplates = () => {
    templateList.innerHTML = '';
    templates.forEach(template => {
      const li = document.createElement('li');
      li.classList.add('template-card');
      li.innerHTML = `
      <span class="template-subject">${template.subject}</span>
      <div>
        <button class="preview-button" data-id="${template.tid}">Preview</button>
        <button class="save-button" data-id="${template.tid}">Save</button>
        <button class="use-button" data-id="${template.tid}">Use</button>
      </div>
    `;
      templateList.appendChild(li);
    });

    const request = new Request("http://localhost:8080/get-all-templates", {
      method: "GET",
    });

    let response = fetch(request)
      .then(response => response.json())
      .then(data => {
        data.forEach((template) => {
          if (template.publicly || (!template.publicly && localStorage.getItem("ID") == template.uid)) {
            let li = document.createElement("li")
            li.classList.add("template-card")
            li.innerHTML = `
              <span class="template-subject">${template.subject}</span>
              <div>
                <button class="preview-button" data-id="${template.tid}">Preview</button>
                <button class="save-button" data-id="${template.tid}">Save</button>
                <button class="use-button" data-id="${template.tid}">Use</button>
              </div>
            `;
            templateList.appendChild(li)
          }

        })
      })
      .catch(function () {

      });

  };
  populateTemplates();

  document.getElementById("template-search-bar").addEventListener('keyup', searchTemplate)

  function searchTemplate() {
    let subject = document.getElementById("template-search-bar").value

    if (subject == '') {
      populateTemplates()
      return
    }

    const request = new Request("http://localhost:8080/search-templates/" + subject, {
      method: "GET",
    });

    let response = fetch(request)
      .then(response => response.json())
      .then(data => {
        templateList.innerHTML = ''
        data.forEach((template) => {
          if (template.publicly || (!template.publicly && localStorage.getItem("ID") == template.uid)) {
            let li = document.createElement("li")
            li.classList.add("template-card")
            li.innerHTML = `
              <span class="template-subject">${template.subject}</span>
              <div>
                <button class="preview-button" data-id="${template.tid}">Preview</button>
                <button class="save-button" data-id="${template.tid}">Save</button>
                <button class="use-button" data-id="${template.tid}">Use</button>
              </div>
            `;
            templateList.appendChild(li)
          }

        })
      })
      .catch(function () {

      });
  }

  // Populate Folders
  const populateFolders = () => {
    folderList.innerHTML = '';

    Object.keys(folders).forEach(folder => {
      const li = document.createElement('li');
      li.textContent = folder;
      li.classList.add('folder-item');
      folderList.appendChild(li);
    });

    const request = new Request("http://localhost:8080/get-all-folders", {
      method: "GET",
    });

    let response = fetch(request)
      .then(response => response.json())
      .then(data => {
        data.forEach((folder) => {
          if (folder.uid == localStorage.getItem('ID') && folder.tid == 0) {
            let li = document.createElement('li');
            li.textContent = folder.name;
            li.classList.add('folder-item');
            li.value = folder.fid;
            folderList.appendChild(li);
          }
        })
      })
  };

  populateFolders();

  // Handle Folder Click (Select + Accordion)
  folderList.addEventListener('click', (e) => {

    let wasSelected = e.target.classList.contains('selected')

    if (e.target.classList.contains('folder-item')) {

      // Accordion functionality
      const folderName = e.target.textContent.trim();
      const folderContents = document.querySelector(`.folder-contents[data-folder="${folderName}"]`);

      if (folderContents && !folderContents.classList.contains('hidden')) {
        e.target.classList.remove('selected')
      } else {
        document.querySelectorAll('.folder-item').forEach(folder => folder.classList.remove('selected'));
        if (!wasSelected) {
          e.target.classList.add('selected')
        }
      }


      if (folderContents) {
        // Toggle visibility
        folderContents.classList.toggle('hidden');
      } else {
        // Create the accordion content
        const newFolderContents = document.createElement('ul');
        newFolderContents.classList.add('folder-contents');
        newFolderContents.setAttribute('data-folder', folderName);
        newFolderContents.innerHTML = ''
        // Populate with templates
        if (folders[folderName] == null) {
          const request = new Request("http://localhost:8080/get-folder/" + folderName + "/" + localStorage.getItem("ID"), {
            method: "GET",
          });

          let response = fetch(request)
            .then(response => response.json())
            .then(data => {
              if (data.length > 1) {
                data.forEach((fold) => {
                  if (fold.uid == localStorage.getItem('ID') && fold.tid != 0) {
                    const request = new Request("http://localhost:8080/get-template/" + fold.tid, {
                      method: "GET",
                    });

                    let response = fetch(request)
                      .then(response => response.json())
                      .then(template => {
                        newFolderContents.innerHTML +=
                          `<li class="template-in-folder" data-id="${template.tid}">
                          ${template.subject}
                          <button class="delete-template-button" id="deleteTemplateButton" data-id="${template.tid}" data-folder="${folderName}">X</button>
                          </li>
                        `
                      })

                  }
                })
              }
              else {
                newFolderContents.innerHTML = '<li class="empty-folder-message">No templates in this folder.</li>';
              }
            })
        }
        else if (folders[folderName].length === 0) {
          newFolderContents.innerHTML = '<li class="empty-folder-message">No templates in this folder.</li>';
        } else {
          folders[folderName].forEach((template) => {
            newFolderContents.innerHTML +=
              `<li class="template-in-folder" data-id="${template.tid}">
              ${template.subject}
              <button class="delete-template-button" id="deleteTemplateButton" data-id="${template.tid}" data-folder="${folderName}">X</button>
              </li>
            `
          })
        }

        e.target.after(newFolderContents);
      }
    }
  });

  // Handle Saved Template Click (Select + Preview)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('template-in-folder')) {
      const templateElement = e.target;
      const templateId = templateElement.dataset.id;
      const template = templates.find(t => t.tid == templateId);

      // Deselect all templates before selecting the current one
      document.querySelectorAll('.template-in-folder').forEach(t => t.classList.remove('selected'));
      templateElement.classList.add('selected');

      // Remove any existing preview popup to prevent stacking
      const existingPopup = document.getElementById('template-preview-popup');
      if (existingPopup) existingPopup.remove();

      // Show the preview popup
      const previewModal = document.createElement('div');
      previewModal.classList.add('popup');
      previewModal.id = 'template-preview-popup';
      previewModal.innerHTML = `
      <h3>Template Preview</h3>
      <div class="template-preview-content">
        <strong>${template.subject}</strong>
        <p>${template.action}</p>
      </div>
      <div class="popup-actions">
        <button id="close-preview-popup">Close</button>
      </div>
    `;
      document.body.appendChild(previewModal);

      // Close the Preview Popup
      document.getElementById('close-preview-popup').addEventListener('click', () => {
        previewModal.remove();
        templateElement.classList.remove('selected'); // Deselect the template
      });
    }
  });

  // Handle Delete Template Button Click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-template-button')) {
      const templateId = e.target.dataset.id;
      const folderName = e.target.dataset.folder;

      // Create a confirmation popup
      const deleteTemplatePopup = document.createElement('div');
      deleteTemplatePopup.classList.add('popup');
      deleteTemplatePopup.id = 'delete-template-popup';
      deleteTemplatePopup.innerHTML = `
      <h3>Delete Template</h3>
      <p>Are you sure you want to delete this template from "${folderName}"?</p>
      <div class="popup-actions">
        <button id="confirm-delete-template">Delete</button>
        <button id="cancel-delete-template">Cancel</button>
      </div>
    `;
      document.body.appendChild(deleteTemplatePopup);

      // Confirm Delete Template
      document.getElementById('confirm-delete-template').addEventListener('click', () => {
        // Remove the template from the folder

        const request1 = new Request("http://localhost:8080/delete-folder-template/" + templateId + "/" +  folderName, {
          method: "DELETE",
        });

        let response = fetch(request1)
          .then(response => response.json())
          .then(data => {
            if(folderName == "My Templates"){
              const request2 = new Request("http://localhost:8080/delete/" + templateId, {
                method: "DELETE",
              });

              let response = fetch(request2)
              .then(response => response.json())
              .then(data => {
                populateTemplates()
              })
            }
            else{
              folders[folderName] = folders[folderName].filter(t => t.tid != templateId);
            }
                // Update the folder accordion
            updateFolderAccordion(folderName);
            populateTemplates()
            deleteTemplatePopup.remove(); // Close the popup

          })
      });

      // Cancel Delete Template
      document.getElementById('cancel-delete-template').addEventListener('click', () => {
        deleteTemplatePopup.remove(); // Close the popup
      });
    }
  });

  // Handle Create Folder
  document.getElementById('create-folder').addEventListener('click', () => {
    const createFolderPopup = document.createElement('div');
    createFolderPopup.classList.add('popup');
    createFolderPopup.id = 'create-folder-popup';
    createFolderPopup.innerHTML = `
    <h3>Create New Folder</h3>
    <input type="text" id="new-folder-name" placeholder="Enter folder name">
    <p id="create-folder-message" class="popup-message"></p>
    <div class="popup-actions">
      <button id="confirm-create-folder">Create</button>
      <button id="cancel-create-folder">Cancel</button>
    </div>
  `;
    document.body.appendChild(createFolderPopup);

    // Confirm Create Folder
    document.getElementById('confirm-create-folder').addEventListener('click', () => {
      const folderName = document.getElementById('new-folder-name').value.trim();
      const messageElement = document.getElementById('create-folder-message');

      if (!folderName) {
        messageElement.textContent = 'Folder name cannot be empty.';
        messageElement.style.color = 'red';
        return;
      }

      if (folders[folderName]) {
        messageElement.textContent = 'Folder already exists.';
        messageElement.style.color = 'red';
        return;
      }

      const request = new Request("http://localhost:8080/create-folder", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ name: folderName, tid: "", uid: localStorage.getItem('ID') })
      });

      let response = fetch(request)
        .then(response => response.json)
        .then(data => {
          populateFolders()
          messageElement.textContent = `Folder created!`;
          messageElement.style.color = 'green';
          setTimeout(() => {
            createFolderPopup.remove();
          }, 400);
        })
    });

    // Cancel Create Folder
    document.getElementById('cancel-create-folder').addEventListener('click', () => {
      createFolderPopup.remove(); // Close the popup
    });
  });

  // Handle Delete Folder
  document.getElementById('delete-folder').addEventListener('click', () => {
    const selectedFolder = document.querySelector('#folder-list .folder-item.selected');

    if (!selectedFolder) {
      alert('Please select a folder to delete.');
      return;
    }

    const folderName = selectedFolder.textContent.trim();

    if (folderName === 'My Templates' || folderName === 'Saved Templates') {
      alert('Default folders cannot be deleted.');
      return;
    }

    // Create a confirmation popup
    const deletePopup = document.createElement('div');
    deletePopup.classList.add('popup');
    deletePopup.id = 'delete-folder-popup';
    deletePopup.innerHTML = `
    <h3>Delete Folder</h3>
    <p>Are you sure you want to delete the folder "${folderName}"?</p>
    <div class="popup-actions">
      <button id="confirm-delete-folder">Delete</button>
      <button id="cancel-delete-folder">Cancel</button>
    </div>
  `;
    document.body.appendChild(deletePopup);

    // Confirm Delete Folder
    document.getElementById('confirm-delete-folder').addEventListener('click', () => {
      if (folders[folderName]) {
        delete folders[folderName];
      }
      else {
        const request = new Request("http://localhost:8080/delete-folder/" + folderName + "" + "/" + localStorage.getItem("ID"), {
          method: "DELETE",
        });

        let response = fetch(request)
          .then(response => response.json())
          .then(data => {

            populateFolders(); // Re-populate the folder list
            deletePopup.remove(); // Close the popup

          })
      }
    });

    // Cancel Delete Folder
    document.getElementById('cancel-delete-folder').addEventListener('click', () => {
      deletePopup.remove(); // Close the popup
    });
  });

  // Handle Save Button Click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-button')) {
      const templateId = e.target.dataset.id;
      let template = templates.find(t => t.tid == templateId);

      if (template == null) {
        const request = new Request("http://localhost:8080/get-template/" + templateId, {
          method: "GET",
        });

        let response = fetch(request)
          .then(response => response.json())
          .then(data => {
            template = data
            const request = new Request("http://localhost:8080/get-all-folders", {
              method: "GET",
            });
            let folderElements = ""
            let response = fetch(request)
              .then(response => response.json())
              .then(data => {
                data.forEach((folder) => {
                  if(folder.tid == 0 && localStorage.getItem("ID") == folder.uid)
                    folderElements += `<li class='folder-item' data-folder='${folder.name}'>${folder.name}</li>`
                })

                // Create the Save Popup
                const savePopup = document.createElement('div');
                savePopup.classList.add('popup');
                savePopup.id = 'save-template-popup';
                savePopup.innerHTML = `
              <h3>Save Template</h3>
              <p>Select a folder to save the template:</p>
              <ul id="save-folder-list">
                ${Object.keys(folders).map(folder => `<li class="folder-item" data-folder="${folder}">${folder}</li>`).join('')}
                ${folderElements}
              </ul>
              <p id="save-popup-message" class="popup-message"></p>
              <div class="popup-actions">
                <button id="cancel-save-template">Cancel</button>
              </div>
              `;
                document.body.appendChild(savePopup);


                // Handle Folder Selection
                document.getElementById('save-folder-list').addEventListener('click', (e) => {
                  
                  if (e.target.classList.contains('folder-item')) {
                    const folderName = e.target.dataset.folder;
                    const messageElement = document.getElementById('save-popup-message');
                    const cancelButton = document.getElementById('cancel-save-template');
                    

                    // Restrict saving to "My Templates"
                    if (folderName === 'My Templates') {
                      messageElement.textContent = 'Templates cannot be saved to "My Templates".';
                      messageElement.style.color = 'red';
                      return;
                    }

                    // Prevent duplicates
                    const request = new Request("http://localhost:8080/get-folder/" + folderName + "/" + localStorage.getItem("ID"), {
                      method: "GET",
                    });
                    let response = fetch(request)
                      .then(response => response.json())
                      .then(data => {
                        let alreadyIn = false;
                        data.forEach((fold) => {

                          if(fold.tid == templateId){
                            alreadyIn = true;
                          }

                        })

                        let inDatabase = false;
                        if(data.length > 0){
                          inDatabase = true
                        }
                        if (inDatabase && alreadyIn && data[0].name == folderName) {
                          messageElement.textContent = 'This template is already saved in the selected folder.';
                          messageElement.style.color = 'red';
                          return;
                        } 
                        else if (!inDatabase && (folders[folderName].some(t => t.tid == templateId))) {
                          messageElement.textContent = 'This template is already saved in the selected folder.';
                          messageElement.style.color = 'red';
                          return;
                        }
    
                        // Save the template to the folder
                        if(inDatabase && !alreadyIn){
                          const request = new Request("http://localhost:8080/add-to-folder", {
                            headers: {
                              "Content-Type": "application/json"
                            },
                            method: "POST",
                            body: JSON.stringify({ name: folderName, tid: template.tid, uid: localStorage.getItem('ID') })
                          });

                          let response = fetch(request)
                            .then(response => response.json)
                            .then(data => {
                            })
                        }
                        else if(!inDatabase){
                          folders[folderName].push(template);
                        }
                        messageElement.textContent = `Saved!`;
                        messageElement.style.color = 'green';
    
                        // Hide the Cancel button to avoid confusion
                        cancelButton.style.display = 'none';
    
                        // Remove the popup after 2 seconds for a better user experience
                        setTimeout(() => {
                          savePopup.remove();
                          updateFolderAccordion(folderName);
                        }, 750);
                      })

                  }
                  else {
                    const request = new Request("http://localhost:8080/get-folder/" + folderName + "/" + localStorage.getItem("ID"), {
                      method: "GET",
                    });

                    let response = fetch(request)
                      .then(response => response.json())
                      .then(data => {
                        if (data.contains(folderName)) {


                          const request = new Request("http://localhost:8080/add-to-folder", {
                            headers: {
                              "Content-Type": "application/json"
                            },
                            method: "POST",
                            body: JSON.stringify({ name: folderName, tid: template.tid, uid: localStorage.getItem('ID') })
                          });

                          let response = fetch(request)
                            .then(response => response.json)
                            .then(data => {
                              messageElement.textContent = `Saved!`;
                              messageElement.style.color = 'green';

                              // Hide the Cancel button to avoid confusion
                              cancelButton.style.display = 'none';

                              // Remove the popup after 2 seconds for a better user experience
                              setTimeout(() => {
                                savePopup.remove();
                                updateFolderAccordion(folderName);
                              }, 750);
                            })
                        }
                      })
                  }
                  
                })

                // Cancel Save
                document.getElementById('cancel-save-template').addEventListener('click', () => {
                  savePopup.remove(); // Close the popup
                });

              })
          })
      }
      else {
        // Create the Save Popup
        const savePopup = document.createElement('div');
        savePopup.classList.add('popup');
        savePopup.id = 'save-template-popup';
        savePopup.innerHTML = `
        <h3>Save Template</h3>
        <p>Select a folder to save the template:</p>
        <ul id="save-folder-list">
        ${Object.keys(folders).map(folder => `<li class="folder-item" data-folder="${folder}">${folder}</li>`).join('')}
        </ul>
        <p id="save-popup-message" class="popup-message"></p>
        <div class="popup-actions">
        <button id="cancel-save-template">Cancel</button>
        </div>
        `;
        document.body.appendChild(savePopup);

        // Handle Folder Selection
        document.getElementById('save-folder-list').addEventListener('click', (e) => {
          if (e.target.classList.contains('folder-item')) {
            const folderName = e.target.dataset.folder;
            const messageElement = document.getElementById('save-popup-message');
            const cancelButton = document.getElementById('cancel-save-template');

            // Restrict saving to "My Templates"
            if (folderName === 'My Templates') {
              messageElement.textContent = 'Templates cannot be saved to "My Templates".';
              messageElement.style.color = 'red';
              return;
            }

            // Prevent duplicates
            if (folders[folderName].some(t => t.tid == templateId)) {
              messageElement.textContent = 'This template is already saved in the selected folder.';
              messageElement.style.color = 'red';
              return;
            }

            // Save the template to the folder
            folders[folderName].push(template);
            messageElement.textContent = `Saved!`;
            messageElement.style.color = 'green';

            // Hide the Cancel button to avoid confusion
            cancelButton.style.display = 'none';

            // Remove the popup after 2 seconds for a better user experience
            setTimeout(() => {
              savePopup.remove();
              updateFolderAccordion(folderName);
            }, 750);
          }
        });

        // Cancel Save
        document.getElementById('cancel-save-template').addEventListener('click', () => {
          savePopup.remove(); // Close the popup

        });
      }
    }
  });


  // Update Folder Accordion
  const updateFolderAccordion = (folderName) => {
    const folderContents = document.querySelector(`.folder-contents[data-folder="${folderName}"]`);
    if (folderContents) {
      folderContents.innerHTML = ''
      const request = new Request("http://localhost:8080/get-all-folders", {
        method: "GET",
      });
  
      let response = fetch(request)
        .then(response => response.json())
        .then(data => {
          let inDatabase = false;
          if(data.length > 0){
            inDatabase = true
          }
          if(inDatabase){
            data.forEach((folder) => {
              if (folder.name == folderName && folder.uid == localStorage.getItem('ID') && folder.tid != 0) {
                const request = new Request("http://localhost:8080/get-template/" + folder.tid, {
                  method: "GET",
                });
        
                let response = fetch(request)
                  .then(response => response.json())
                  .then(data => {
                    if(folder.tid == data.tid){
                      folderContents.innerHTML += `
                      <li class="template-in-folder" data-id="${folder.tid}">
                      ${data.subject}
                      <button class="delete-template-button" id="deleteTemplateButton" data-id="${folder.tid}" data-folder="${folderName}">X</button>
                      </li>
                    `
                  }
                  })

              }
            })
          }
          else{
            if (folders[folderName].length === 0) {
              folderContents.innerHTML = '<li class="empty-folder-message">No templates in this folder.</li>';
            } else {
              folders[folderName].forEach((template) => {
                folderContents.innerHTML += `
                <li class="template-in-folder" data-id="${template.tid}">
                  ${template.subject}
                  <button class="delete-template-button" id="deleteTemplateButton" data-id="${template.tid}" data-folder="${folderName}">X</button>
                  </li>
                `
              })
      
            }
          }
        })


    }
  };

  // Show Template Preview from Main Template List
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('preview-button')) {
      const templateId = e.target.dataset.id;
      const template = templates.find(t => t.tid == templateId);
      const previewModal = document.createElement('div');

      if (template == null) {
        const request = new Request("http://localhost:8080/get-template/" + templateId, {
          method: "GET",
        });

        let response = fetch(request)
          .then(response => response.json())
          .then(data => {
            previewModal.classList.add('popup');
            previewModal.id = 'template-preview-popup';
            previewModal.innerHTML = `
              <h3>Template Preview</h3>
              <div class="template-preview-content">
                <strong>${data.subject}</strong>
                <p>${data.introduction}</p>
                <p>${data.action}</p>
                <p>${data.closing}</p>
                <p>${data.signature}</p>
              </div>
              <div class="popup-actions">
                <button id="close-preview-popup">Close</button>
              </div>
            `;

            document.body.appendChild(previewModal);

            // Close the Preview Popup
            document.getElementById('close-preview-popup').addEventListener('click', () => {
              previewModal.remove();
            });
          })
          .catch(function () {

          });
      }
      else {
        previewModal.classList.add('popup');
        previewModal.id = 'template-preview-popup';
        previewModal.innerHTML = `
        <h3>Template Preview</h3>
        <div class="template-preview-content">
          <strong>${template.subject}</strong>
          <p>${template.action}</p>
        </div>
        <div class="popup-actions">
          <button id="close-preview-popup">Close</button>
        </div>
      `;
        document.body.appendChild(previewModal);

        // Close the Preview Popup
        document.getElementById('close-preview-popup').addEventListener('click', () => {
          previewModal.remove();
        });
      }

    }
  });

});


// Login Button

function login() {
  window.location.href = "http://localhost:8080"
  window.location.replace("http://localhost:8080")
}

function logout() {
  localStorage.removeItem("ID")
  window.location.href = "http://localhost:8080"
  window.location.replace("http://localhost:8080")
}

function checkLogin() {
  if (localStorage.getItem("ID") == null) {
    document.getElementById("loginButton").classList.remove('hidden')
    document.getElementById("logoutButton").classList.add('hidden')
  }
  else {
    document.getElementById("loginButton").classList.add('hidden')
    document.getElementById("logoutButton").classList.remove('hidden')
  }
}
checkLogin()

function displayTemplate(templateID){
  let useArea = document.getElementById("useArea")
  const request = new Request("http://localhost:8080/get-template/" + templateID, {
      method: "GET",
  });
  useArea.innerText = '';
  let response = fetch(request)
      .then(response => response.json())
      .then(data => {
        const subject = data.subject || '[No Subject]';
        const greeting = data.introduction || '[No Greeting]';
        const body = data.action || '[No Body]';
        const closing = data.closing || '[No Closing]';
        const signature = data.signature || '[No Signature]';


        let preview = `Subject: ${subject}<br><br>${greeting}<br><br>${body}<br><br>${closing}<br><br>${signature}`;

        useArea.innerHTML = preview.replaceAll("[INPUT]", "<input type='text'>")

      })
      .catch(function(){

      });
}

// use

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('use-button')) {
      document.querySelector('.tab.active').classList.remove('active');
      document.querySelector('.content.active').classList.remove('active');

      // Add 'active' class to the clicked tab and corresponding content
      tab5.classList.add('active');
      const contentId = tab5.getAttribute('data-content');
      document.getElementById(contentId).classList.add('active');
      displayTemplate(e.target.dataset.id)
  }
})

document.getElementById('copyButton').addEventListener('click', (e) =>{
    let result = '';
    
    // Iterate through all child nodes in the container
    useArea.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Append plain text
            result += node.textContent;
        } else if (node.tagName === 'INPUT') {
            // Append input values
            result += node.value || '[Unfilled Input]';
        } else if (node.tagName === 'BR') {
            // Preserve line breaks
            result += '\n';
        }
    });

    // Copy the reconstructed content to clipboard
    navigator.clipboard.writeText(result).then(() => {
        alert('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text:', err);
    });
})
