document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-btn');
  const titleInput = document.getElementById('template-title');
  const contentInput = document.getElementById('template-content');
  const templatesList = document.getElementById('templates-list');
  
  // Load saved templates on startup
  loadTemplates();
  
  // Save new template
  saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
      alert('Please fill both title and content fields');
      return;
    }
    
    saveTemplate(title, content);
    titleInput.value = '';
    contentInput.value = '';
  });
  
  // Save template to localStorage
  function saveTemplate(title, content) {
    const templates = JSON.parse(localStorage.getItem('clipboardTemplates') || '[]');
    
    // Create new template object
    const newTemplate = {
      id: Date.now().toString(),
      title,
      content
    };
    
    templates.push(newTemplate);
    localStorage.setItem('clipboardTemplates', JSON.stringify(templates));
    
    // Refresh UI
    loadTemplates();
  }
  
  // Load and display templates
  function loadTemplates() {
    const templates = JSON.parse(localStorage.getItem('clipboardTemplates') || '[]');
    templatesList.innerHTML = '';
    
    if (templates.length === 0) {
      templatesList.innerHTML = '<p>No templates saved yet</p>';
      return;
    }
    
    templates.forEach(template => {
      const templateEl = document.createElement('div');
      templateEl.className = 'template-item';
      templateEl.innerHTML = `
        <div class="template-header">
          <div class="template-title">${template.title}</div>
          <div class="template-actions">
            <button class="copy-btn" data-id="${template.id}">📋 Copy</button>
            <button class="delete-btn" data-id="${template.id}">🗑️ Delete</button>
          </div>
        </div>
        <div class="template-content">${template.content}</div>
      `;
      templatesList.appendChild(templateEl);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', copyTemplate);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteTemplate);
    });
  }
  
  // Copy template to clipboard
  function copyTemplate(event) {
    const templateId = event.target.dataset.id;
    const templates = JSON.parse(localStorage.getItem('clipboardTemplates') || '[]');
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      navigator.clipboard.writeText(template.content)
        .then(() => {
          // Show visual feedback
          event.target.textContent = '✓ Copied!';
          setTimeout(() => {
            event.target.textContent = '📋 Copy';
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          alert('Failed to copy to clipboard. Please try again.');
        });
    }
  }
  
  // Delete template
  function deleteTemplate(event) {
    const templateId = event.target.dataset.id;
    let templates = JSON.parse(localStorage.getItem('clipboardTemplates') || '[]');
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this template?')) {
      templates = templates.filter(template => template.id !== templateId);
      localStorage.setItem('clipboardTemplates', JSON.stringify(templates));
      loadTemplates();
    }
  }
});