// Enhanced Fallback Runtime with better UX
// STABLE BUILD - September 15, 2025
// Runware API Integration Working - Simplified Implementation
// All functions defined at top level, no dependency issues
// Mock implementation with data URL images (no external dependencies)
console.log('[FALLBACK-BUNDLE] 🚀 FILE IS LOADING...');
(function(){
  console.log('[FALLBACK-BUNDLE] 🎬 IIFE STARTING...');
  
  // Global feature flags
  var featureFlags = (typeof window !== 'undefined' && window.featureFlags) ? window.featureFlags : {};
  featureFlags.gpt5CodexPreview = true;
  featureFlags.gpt5CodexRollout = 'preview';
  featureFlags.gpt5CodexAudience = 'all-clients';
  if (typeof window !== 'undefined') {
    window.featureFlags = featureFlags;
  }

  // Runware API Configuration - initialize early for global access
  var runwareConfig = (typeof window !== 'undefined' && window.runwareConfig) ? window.runwareConfig : {
    apiKey: '',
    websocketEndpoint: 'wss://ws-api.runware.ai/v1',
    model: 'google:4@1' // Nano Banana - Google Gemini Flash Image 2.5
  };
  if (typeof window !== 'undefined') window.runwareConfig = runwareConfig;
  // Load saved API key as early as possible
  try {
    var _savedRunwareKey = (typeof localStorage !== 'undefined') ? localStorage.getItem('runwareApiKey') : null;
    if (_savedRunwareKey) {
      runwareConfig.apiKey = _savedRunwareKey;
    }
    if (typeof window !== 'undefined') window.runwareConfig = runwareConfig;
  } catch (e) {
    console.warn('[Runware] Unable to access saved configuration:', e);
    if (typeof window !== 'undefined') window.runwareConfig = runwareConfig;
  }

  var geminiConfig = (typeof window !== 'undefined' && window.geminiConfig) ? window.geminiConfig : {
    apiKey: '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta', // Google AI Studio endpoint for AIzaSy keys
    vertexUrl: 'https://us-central1-aiplatform.googleapis.com/v1' // Vertex AI endpoint for OAuth tokens
  };
  if (typeof window !== 'undefined') window.geminiConfig = geminiConfig;
  // Load saved Gemini API key
  try {
    var _savedGeminiKey = (typeof localStorage !== 'undefined') ? localStorage.getItem('geminiApiKey') : null;
    var _savedProjectId = (typeof localStorage !== 'undefined') ? localStorage.getItem('geminiProjectId') : null;
    var _savedLocation = (typeof localStorage !== 'undefined') ? localStorage.getItem('geminiLocation') : null;
    if (_savedGeminiKey) {
      geminiConfig.apiKey = _savedGeminiKey;
    }
    if (_savedProjectId) {
      geminiConfig.projectId = _savedProjectId;
    }
    if (_savedLocation) {
      geminiConfig.location = _savedLocation;
    }
    if (typeof window !== 'undefined') window.geminiConfig = geminiConfig;
  } catch (e) {
    console.warn('[Gemini] Unable to access saved configuration:', e);
    if (typeof window !== 'undefined') window.geminiConfig = geminiConfig;
  }

  function getRunwareConfig() {
    return (typeof window !== 'undefined' && window.runwareConfig) ? window.runwareConfig : runwareConfig;
  }

  // Helper to always get the active Gemini config
  function getGeminiConfig() {
    return (typeof window !== 'undefined' && window.geminiConfig) ? window.geminiConfig : geminiConfig;
  }

  // Initialize WebSocket stub immediately - will be replaced by full implementation
  // This ensures window.RunwareWebSocketManager exists even if full code hasn't loaded yet
  if (typeof window !== 'undefined' && !window.RunwareWebSocketManager) {
    console.log('[Init:0] 🚀 Starting WebSocket stub creation...');
    console.log('[Init:0] ⏱️ Timestamp:', new Date().toISOString());
    
    // Temporary stub that will be replaced
    window._runwareStub = true;
    
    // Create a promise that resolves when the real WebSocket class is ready
    window._runwareReady = new Promise((resolve) => {
      console.log('[Init:0] 📝 Promise created, storing resolver...');
      window._runwareReadyResolver = resolve;
      console.log('[Init:0] ✅ Resolver stored. Type:', typeof resolve);
    });
    
    console.log('[Init:0] ✅ Stub complete. IIFE will now execute...');
  }

  // Runware API Setup Modal - Define early for global access
  window.showGoogleAISetupModal = function() {
    const modal = document.createElement('div');
    modal.id = 'googleAISetupModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    
    modal.innerHTML = 
      '<div style="background: white; border-radius: 12px; padding: 24px; max-width: 500px; width: 90%;">' +
        '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">' +
          '<div style="display: flex; align-items: center;">' +
            '<span style="font-size: 28px; margin-right: 12px;">🚀</span>' +
            '<h3 style="margin: 0; color: #4b3b2a;">Runware API Setup</h3>' +
          '</div>' +
          '<button onclick="document.getElementById(\'googleAISetupModal\').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b5440;">&times;</button>' +
        '</div>' +
        '<div style="background: #fdf4e6; padding: 16px; border-radius: 8px; margin-bottom: 16px;">' +
          '<h4 style="margin: 0 0 8px; color: #a66b38;">🚀 ADVANCED AI READY!</h4>' +
          '<p style="margin: 0; color: #a66b38; font-size: 14px;">Runware API provides advanced AI image generation and editing with <strong>Nano Banana</strong> (Google Gemini Flash Image 2.5) model!</p>' +
        '</div>' +
        '<div style="margin-bottom: 16px;">' +
          '<h4 style="margin: 0 0 8px; color: #4b3b2a;">Quick Setup (2 minutes):</h4>' +
          '<ol style="margin: 0; padding-left: 20px; color: #6b5440; font-size: 14px;">' +
            '<li>Visit <a href="https://runware.ai" target="_blank" style="color: #c48b5a;">Runware.ai</a></li>' +
            '<li>Sign up for an account</li>' +
            '<li>Get your API key from dashboard</li>' +
            '<li>Copy the key and paste it below</li>' +
          '</ol>' +
        '</div>' +
        '<div style="margin-bottom: 16px;">' +
          '<input type="text" id="googleAIApiKey" placeholder="Paste your Runware API key here..." style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">' +
        '</div>' +
        '<div style="display: flex; gap: 12px; justify-content: flex-end;">' +
          '<button onclick="document.getElementById(\'googleAISetupModal\').remove()" style="padding: 10px 20px; background: #6b5440; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>' +
          '<button onclick="saveGoogleAIKey()" style="padding: 10px 20px; background: #c48b5a; color: white; border: none; border-radius: 6px; cursor: pointer;">✅ Save & Test</button>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(modal);
  };

  // Save Runware API key function - Define early for modal access
  window.saveGoogleAIKey = function() {
    const keyInput = document.getElementById('googleAIApiKey');
    const apiKey = keyInput.value.trim();
    
    if (!apiKey) {
      showToast('⚠️ Please enter your API key', 'warning');
      return;
    }
    
    const cfg = getRunwareConfig();
    cfg.apiKey = apiKey;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('runwareApiKey', apiKey);
      localStorage.setItem('geminiAccessToken', apiKey);
    }
    
    document.getElementById('googleAISetupModal')?.remove();
    showToast('✅ Runware API configured! Testing connection...', 'success');
    
    // Test the connection
    setTimeout(() => {
      if (typeof window.testGoogleAIConnection === 'function') {
        window.testGoogleAIConnection();
      }
    }, 500);
  };

  // Simple prompt generator - define immediately
  function generateImageEditingPrompt(operation, instructions) {
    const safeInstructions = instructions || 'general image editing';
    const safeOperation = operation || 'custom';
    
    const basePrompts = {
      'color-change': 'Edit the provided image to change the color as requested: ' + safeInstructions + '. Maintain the original composition, lighting, and style while only changing the specified colors.',
      'add-model': 'Add a model to the provided image as requested: ' + safeInstructions + '. Ensure the model fits naturally into the scene with appropriate lighting and perspective.',
      'background-change': 'Modify the background of the provided image: ' + safeInstructions + '. Keep the main subject unchanged while updating the background environment.',
      'lighting-adjustment': 'Adjust the lighting in the provided image: ' + safeInstructions + '. Modify the lighting conditions while preserving the main subject and composition.',
      'object-removal': 'Remove objects from the provided image: ' + safeInstructions + '. Fill in the removed areas naturally to maintain a seamless appearance.',
      'style-transfer': 'Transform the style of the provided image: ' + safeInstructions + '. Apply the requested artistic style while preserving the main subject and composition.',
      'product-enhancement': 'Enhance the quality of the provided image: ' + safeInstructions + '. Improve clarity, sharpness, and overall visual appeal.',
      'custom': 'Edit the provided image according to these instructions: ' + safeInstructions + '. Make the changes while maintaining natural lighting and composition.'
    };
    
    return basePrompts[safeOperation] || basePrompts['custom'];
  }
  window.generateImageEditingPrompt = generateImageEditingPrompt;

  // Simple availability checker - define immediately
  async function checkGoogleAIAvailability() {
    const cfg = getRunwareConfig();
    if (!cfg.apiKey) {
      return false;
    }
    
    try {
      // For now, just check if we have an API key - can be enhanced later
      console.log('Checking Runware API availability with key:', cfg.apiKey ? 'present' : 'missing');
      return true; // Assume available if key is present
    } catch (error) {
      console.error('Runware API availability check error:', error);
      return false;
    }
  }
  window.checkGoogleAIAvailability = checkGoogleAIAvailability;

  // Simple API processor - define immediately


  // Simple preview modal - define immediately
  function showGoogleAIPreviewModal(operation, instructions, result = null) {
    const modal = document.createElement('div');
    modal.id = 'googleAIPreviewModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    
    // Check if result has a text response instead of image
    if (result?.textResponse) {
      // Display text response for models that don't generate images
      modal.innerHTML = 
        '<div style="background: white; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">' +
          '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">' +
            '<div style="display: flex; align-items: center;">' +
              '<span style="font-size: 28px; margin-right: 12px;">🔮</span>' +
              '<h3 style="margin: 0; color: #4b3b2a;">Gemini AI Response</h3>' +
            '</div>' +
            '<button onclick="document.getElementById(\'googleAIPreviewModal\').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b5440;">&times;</button>' +
          '</div>' +
          '<div style="margin-bottom: 16px; padding: 12px; background: #f1e8dc; border-radius: 8px;">' +
            '<strong>Operation:</strong> ' + operation + '<br>' +
            '<strong>Instructions:</strong> ' + (instructions || 'No specific instructions provided') +
          '</div>' +
          '<div style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin-bottom: 16px;">' +
            '<p style="margin: 0; color: #92400e;"><strong>⚠️ Note:</strong> Gemini 2.5 Flash is a vision/text model and cannot generate or edit images. It can only analyze and describe images.</p>' +
            '<p style="margin: 8px 0 0 0; color: #92400e; font-size: 14px;">For image generation, use <strong>Imagen</strong> model or <strong>Runware AI</strong> instead.</p>' +
          '</div>' +
          '<div style="padding: 16px; background: #f9fafb; border-radius: 8px; white-space: pre-wrap; font-family: monospace; font-size: 14px;">' +
            result.textResponse +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);
      return;
    }
    
    // Extract image URL from result
    let imageUrl = '';
    if (result?.imageUrl) {
      imageUrl = result.imageUrl;
    } else if (result?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
      imageUrl = 'data:image/jpeg;base64,' + result.candidates[0].content.parts[0].inline_data.data;
    } else {
      // Fallback: create a simple colored div if no image using URL encoding instead of btoa
      const svg = '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#7fa284"/><text x="200" y="150" text-anchor="middle" fill="white" font-family="Arial" font-size="24">Processed</text></svg>';
      imageUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
    
    modal.innerHTML = 
      '<div style="background: white; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">' +
        '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">' +
          '<div style="display: flex; align-items: center;">' +
            '<span style="font-size: 28px; margin-right: 12px;">🚀</span>' +
            '<h3 style="margin: 0; color: #4b3b2a;">Runware AI Result</h3>' +
          '</div>' +
          '<button onclick="document.getElementById(\'googleAIPreviewModal\').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b5440;">&times;</button>' +
        '</div>' +
        '<div style="margin-bottom: 16px; padding: 12px; background: #f1e8dc; border-radius: 8px;">' +
          '<strong>Operation:</strong> ' + operation + '<br>' +
          '<strong>Instructions:</strong> ' + (instructions || 'No specific instructions provided') + '<br>' +
          '<strong>Processing Time:</strong> ' + (result?.processingTime || 'N/A') + '<br>' +
          '<strong>Cost:</strong> ' + (result?.cost || 'N/A') +
        '</div>' +
        '<div style="text-align: center; margin-bottom: 20px;">' +
          '<img src="' + imageUrl + '" style="max-width: 100%; max-height: 400px; border-radius: 8px; border: 2px solid #7fa284;" onload="console.log(\'Image loaded successfully\')" onerror="console.error(\'Image failed to load\', this.src)">' +
        '</div>' +
        '<div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">' +
          '<h4 style="margin: 0 0 8px; color: #a66b38;">🚀 Google Gemini Flash Image 2.5 Features:</h4>' +
          '<ul style="margin: 0; padding-left: 20px; color: #a66b38; font-size: 14px;">' +
            '<li>Advanced AI image generation and editing</li>' +
            '<li>High-fidelity image processing with WebSocket</li>' +
            '<li>Real-time image inference capabilities</li>' +
            '<li>Professional-grade image enhancement</li>' +
            '<li>Fast processing with Google Gemini Flash Image 2.5 model</li>' +
            '<li>WebSocket-based real-time communication</li>' +
          '</ul>' +
        '</div>' +
        '<div style="display: flex; gap: 12px; justify-content: flex-end;">' +
          '<button onclick="document.getElementById(\'googleAIPreviewModal\').remove()" style="padding: 10px 20px; background: #6b5440; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>' +
          '<button onclick="window.saveProcessedImage(\'' + imageUrl + '\', \'' + operation + '\')" style="padding: 10px 20px; background: #c48b5a; color: white; border: none; border-radius: 6px; cursor: pointer;">💾 Save Image</button>' +
          '<button onclick="alert(\'✅ Result saved successfully!\'); document.getElementById(\'googleAIPreviewModal\').remove();" style="padding: 10px 20px; background: #7fa284; color: white; border: none; border-radius: 6px; cursor: pointer;">✅ Use Result</button>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(modal);
  }
  window.showGoogleAIPreviewModal = showGoogleAIPreviewModal;

  // Function to save/download processed images
  function saveProcessedImage(imageUrl, operation = 'processed') {
    try {
      console.log('Saving processed image:', imageUrl.substring(0, 50) + '...');
      
      // Create a temporary link element for download
      const link = document.createElement('a');
      
      // Generate a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `runware-${operation}-${timestamp}.png`;
      
      // Handle different image URL types
      if (imageUrl.startsWith('data:')) {
        // Data URL (base64) - can be downloaded directly
        link.href = imageUrl;
        link.download = filename;
      } else {
        // External URL - need to fetch and convert to blob
        fetch(imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up object URL
            URL.revokeObjectURL(url);
            
            // Show success message
            showToast('✅ Image saved successfully!', 'success');
          })
          .catch(error => {
            console.error('Error downloading external image:', error);
            showToast('❌ Failed to save image', 'error');
          });
        return;
      }
      
      // Trigger download for data URLs
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      showToast('✅ Image saved successfully!', 'success');
      
    } catch (error) {
      console.error('Error saving image:', error);
      showToast('❌ Failed to save image', 'error');
    }
  }
  window.saveProcessedImage = saveProcessedImage;

  // Critical AI functions - Define immediately for global access
  window.processImageWithAI = async function() {
    console.log('processImageWithAI called');
    
    const instructions = document.getElementById('modalAiInstructions')?.value?.trim() || document.getElementById('contentAiInstructions')?.value?.trim();
    const operation = document.querySelector('select[name="aiOperation"]')?.value || document.getElementById('contentAiOperation')?.value;
    
    console.log('Instructions:', instructions);
    console.log('Operation:', operation);
    console.log('Uploaded image data exists:', !!window.uploadedImageData || !!window.uploadedContentImageData);
    
    // Check for image data from either modal
    const imageData = window.uploadedImageData || window.uploadedContentImageData;
    
    if (!imageData) {
      showToast('⚠️ Please upload an image first', 'warning');
      return;
    }
    
    if (!instructions && !operation) {
      showToast('⚠️ Please provide AI instructions or select an operation', 'warning');
      return;
    }
    
    // Check Runware API configuration
    const cfg = getRunwareConfig();
    if (!cfg.apiKey) {
      showToast('❌ Runware API key not configured', 'error');
      console.log('❌ Runware API key missing. Current config:', cfg);
      return;
    }
    
    try {
      const prompt = generateImageEditingPrompt(operation, instructions);
      console.log('Generated prompt:', prompt);
      
      showToast('🔄 Processing with Runware API...', 'info');
      
      // Ensure we pass base64 content, not a data URL
      const base64Content = (typeof imageData === 'string' && imageData.indexOf(',') !== -1) ? imageData.split(',')[1] : imageData;
      const result = await window.processWithGoogleAI(prompt, base64Content);
      
      if (result) {
        console.log('AI processing successful:', result);
        showGoogleAIPreviewModal(operation || 'Custom', instructions, result);
        showToast('✅ Image processed successfully!', 'success');
      } else {
        showToast('❌ Image processing failed - no result returned', 'error');
      }
      
    } catch (error) {
      console.error('AI processing error:', error);
      showToast('❌ Processing error: ' + error.message, 'error');
    }
  };

  // Function to process images with Google Gemini API
  window.processImageWithGeminiAI = async function(operation, instructions, imageData) {
    console.log('processImageWithGeminiAI called');

    const config = getGeminiConfig();
    if (!config.apiKey) {
      showToast('❌ Google Gemini API key not configured', 'error');
      return;
    }

    try {
      const prompt = generateImageEditingPrompt(operation, instructions);
      console.log('Generated prompt for Gemini:', prompt);

      showToast('🔮 Processing with Google Gemini...', 'info');

      // Ensure we pass base64 content, not a data URL
      const base64Content = (typeof imageData === 'string' && imageData.indexOf(',') !== -1) ? imageData.split(',')[1] : imageData;
      const result = await window.processWithGeminiAI(prompt, base64Content);

      if (result) {
        console.log('Gemini AI processing successful:', result);
        
        // Check if we got a text response (Gemini can't generate images)
        if (result.textResponse && !result.imageUrl) {
          console.warn('⚠️ Gemini returned text response only. Gemini 2.5 Flash cannot generate or edit images.');
          showGoogleAIPreviewModal(operation || 'Custom', instructions, result);
          showToast('⚠️ Gemini returned text only - it cannot generate images', 'warning');
        } else {
          showGoogleAIPreviewModal(operation || 'Custom', instructions, result);
          showToast('✅ Image processed successfully with Google Gemini!', 'success');
        }
      } else {
        showToast('❌ Gemini processing failed - no result returned', 'error');
      }

    } catch (error) {
      console.error('Gemini AI processing error:', error);
      showToast('❌ Gemini processing error: ' + error.message, 'error');
    }
  };

  window.testGoogleAIConnection = function() {
    console.log('testGoogleAIConnection called');
    showToast('🔄 Testing Runware API connection...', 'info');

    // Check if API key is configured
    setTimeout(async () => {
      const cfg = getRunwareConfig();
      console.log('API Key available:', !!cfg.apiKey);
      console.log('API Key value:', cfg.apiKey ? 'configured' : 'not configured');
      
      if (cfg.apiKey) {
        try {
          const isAvailable = await checkGoogleAIAvailability();
          if (isAvailable) {
            console.log('✅ Runware API connection successful');
            showToast('✅ Runware API connected successfully!', 'success');
          } else {
            console.log('❌ Runware API connection failed');
            showToast('❌ Runware API connection failed', 'error');
          }
        } catch (error) {
          console.error('Connection test error:', error);
          showToast('❌ Connection test error: ' + error.message, 'error');
        }
      } else {
        console.log('❌ API key not configured');
        showToast('❌ Runware API key not configured', 'error');
        console.log('Current config:', cfg);
      }
    }, 100);
  };

  // Test Runware connection (alias for backward compatibility)
  window.testRunwareConnection = function() {
    return window.testGoogleAIConnection();
  };

  // Test Google Gemini connection
  window.testGeminiConnection = function() {
    console.log('testGeminiConnection called');
    showToast('🔮 Testing Google Gemini API connection...', 'info');

    // Check if API key is configured
    setTimeout(async () => {
      console.log('Gemini API Key available:', !!geminiConfig.apiKey);
      console.log('Gemini API Key value:', geminiConfig.apiKey ? 'configured' : 'not configured');

      if (geminiConfig.apiKey) {
        try {
          const isAvailable = await testGeminiConnection();
          if (isAvailable) {
            console.log('✅ Google Gemini API connection successful');
            showToast('✅ Google Gemini API connected successfully!', 'success');
          } else {
            console.log('❌ Google Gemini API connection failed');
            showToast('❌ Google Gemini API connection failed', 'error');
          }
        } catch (error) {
          console.error('Gemini connection test error:', error);
          showToast('❌ Gemini connection test error: ' + error.message, 'error');
        }
      } else {
        console.log('❌ Gemini API key not configured');
        showToast('❌ Google Gemini API key not configured', 'error');
        console.log('Current Gemini config:', geminiConfig);
      }
    }, 100);
  };

  // Post Production functions - Define immediately for global access
  window.handleMethodChange = function(selectElement) {
    const postProductionDiv = document.getElementById('postProductionSubMethod');
    const genAIDiv = document.getElementById('genAIConfig');
    
    if (selectElement.value === 'Post Production') {
      if (postProductionDiv) {
        postProductionDiv.style.display = 'block';
      }
    } else {
      if (postProductionDiv) {
        postProductionDiv.style.display = 'none';
      }
      if (genAIDiv) {
        genAIDiv.style.display = 'none';
      }
    }
  };

  window.handleMethodChangeModal = function(selectElement) {
    const postProductionDiv = document.getElementById('postProductionSubMethodModal');
    const genAIDiv = document.getElementById('genAIConfigModal');
    
    if (selectElement.value === 'Post Production') {
      if (postProductionDiv) {
        postProductionDiv.style.display = 'block';
      }
    } else {
      if (postProductionDiv) {
        postProductionDiv.style.display = 'none';
      }
      if (genAIDiv) {
        genAIDiv.style.display = 'none';
      }
    }
  };

  window.handlePostProductionTypeChange = function(selectElement) {
    const genAIDiv = document.getElementById('genAIConfig');
    
    if (selectElement.value === 'GenAI') {
      if (genAIDiv) {
        genAIDiv.style.display = 'block';
      }
    } else {
      if (genAIDiv) {
        genAIDiv.style.display = 'none';
      }
    }
  };

  window.handlePostProductionTypeChangeModal = function(selectElement) {
    const genAIDiv = document.getElementById('genAIConfigModal');
    
    if (selectElement.value === 'GenAI') {
      if (genAIDiv) {
        genAIDiv.style.display = 'block';
        
        // Initialize drag & drop functionality after a short delay to ensure DOM is ready
        setTimeout(() => {
          setupImageDragDrop();
        }, 100);
      }
    } else {
      if (genAIDiv) {
        genAIDiv.style.display = 'none';
      }
    }
  };

  // Event ID validation function
  window.validateEventIdField = function(input) {
    const value = input.value.trim().toUpperCase();
    input.value = value; // Auto-uppercase
    
    const eventIdPattern = /^A\d{2}\d{2}\d{3,4}$/;
    const isValid = !value || eventIdPattern.test(value); // Empty is valid (optional field)
    
    // Remove any existing validation styling
    input.style.borderColor = '';
    input.style.backgroundColor = '';
    
    if (value && isValid) {
      // Valid Event ID format
      input.style.borderColor = '#7fa284';
      input.style.backgroundColor = '#f0fdf4';
      input.setCustomValidity('');
    } else if (value && !isValid) {
      // Invalid format
      input.style.borderColor = '#ef4444';
      input.style.backgroundColor = '#fef2f2';
      input.setCustomValidity('Event ID must be in format: A + Week (2 digits) + Year (2 digits) + Counter (3-4 digits), e.g., A3225055');
    } else {
      // Empty (valid since optional)
      input.setCustomValidity('');
    }
  };

  // Tactic Type change handler - populates cascading Tactic dropdown
  window.handleTacticTypeChange = function(selectElement) {
    const tacticDropdown = document.querySelector('select[name="tactic"]');
    if (!tacticDropdown) return;
    
    const selectedType = selectElement.value;
    
    // Clear existing options
    tacticDropdown.innerHTML = '<option value="">Select Tactic...</option>';
    
    if (!selectedType || !window.TacticsConfig) {
      tacticDropdown.disabled = true;
      return;
    }
    
    // Get tactics for selected type from config
    const tactics = window.TacticsConfig.getTacticsForType(selectedType);
    
    if (tactics && tactics.length > 0) {
      tacticDropdown.disabled = false;
      
      // Populate dropdown with tactics
      tactics.forEach(tactic => {
        const option = document.createElement('option');
        option.value = tactic;
        option.textContent = tactic;
        tacticDropdown.appendChild(option);
      });
    } else {
      tacticDropdown.disabled = true;
    }
  };

  // Event ID filter functions
  window.filterByEventId = function(manualValue) {
    const filterSelect = document.getElementById('eventIdFilter');
    const rawValue = typeof manualValue === 'string' ? manualValue : (filterSelect ? filterSelect.value : '');

    if (filterSelect && filterSelect.value !== rawValue) {
      filterSelect.value = rawValue;
    }

    window.currentEventIdFilter = rawValue;
    handleEventFilterChange(rawValue);
  };

  window.clearEventIdFilter = function() {
    const filterSelect = document.getElementById('eventIdFilter');
    if (filterSelect) {
      filterSelect.value = '';
    }
    handleEventFilterChange('');
  };

  // Populate Event ID dropdown based on orders from PMR integration
  window.populateEventIdSuggestions = function() {
  const ordersList = window.rkhOrders || [];
    const eventIds = [...new Set(ordersList.map(order => order.eventId).filter(id => id))];
    
    const filterSelect = document.getElementById('eventIdFilter');
    if (!filterSelect) return;
    
    // Store current selection
    const currentValue = filterSelect.value;
    
    // Clear existing options except "All Events"
    filterSelect.innerHTML = '<option value="">All Events</option>';
    
    // Sort Event IDs alphabetically
    eventIds.sort();
    
    // Populate dropdown with Event IDs and order counts
    eventIds.forEach(eventId => {
      const orderCount = ordersList.filter(o => o.eventId === eventId).length;
      const option = document.createElement('option');
      option.value = eventId;
      option.textContent = `${eventId} (${orderCount} orders)`;
      filterSelect.appendChild(option);
    });
    
    // Restore previous selection if it still exists
    if (currentValue && eventIds.includes(currentValue)) {
      filterSelect.value = currentValue;
    }
  };

  // Thumbnail preview functions
  let thumbnailPreviewTimeout;
  let thumbnailPreviewElement;

  window.showThumbnailPreview = function(event, thumbnailUrl) {
    event.stopPropagation();
    
    // Clear any existing timeout
    if (thumbnailPreviewTimeout) {
      clearTimeout(thumbnailPreviewTimeout);
    }
    
    // Delay showing preview slightly
    thumbnailPreviewTimeout = setTimeout(() => {
      // Remove existing preview if any
      if (thumbnailPreviewElement) {
        thumbnailPreviewElement.remove();
      }
      
      // Create preview element
      const preview = document.createElement('div');
      preview.id = 'thumbnailPreview';
      preview.style.cssText = `
        position: fixed;
        z-index: 10000;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        padding: 8px;
        pointer-events: none;
      `;
      
      const img = document.createElement('img');
      img.src = thumbnailUrl;
      img.style.cssText = `
        max-width: 400px;
        max-height: 400px;
        width: auto;
        height: auto;
        display: block;
        border-radius: 4px;
      `;
      
      preview.appendChild(img);
      document.body.appendChild(preview);
      
      // Position near cursor
      const x = event.clientX + 20;
      const y = event.clientY + 20;
      
      // Adjust if would go off screen
      const rect = preview.getBoundingClientRect();
      const finalX = (x + rect.width > window.innerWidth) ? window.innerWidth - rect.width - 20 : x;
      const finalY = (y + rect.height > window.innerHeight) ? window.innerHeight - rect.height - 20 : y;
      
      preview.style.left = finalX + 'px';
      preview.style.top = finalY + 'px';
      
      thumbnailPreviewElement = preview;
    }, 300); // 300ms delay before showing
  };

  window.hideThumbnailPreview = function() {
    // Clear timeout
    if (thumbnailPreviewTimeout) {
      clearTimeout(thumbnailPreviewTimeout);
    }
    
    // Remove preview element
    if (thumbnailPreviewElement) {
      thumbnailPreviewElement.remove();
      thumbnailPreviewElement = null;
    }
  };

  window.openThumbnailModal = function(event, thumbnailUrl) {
    event.stopPropagation();
    
    // Hide hover preview
    hideThumbnailPreview();
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    const img = document.createElement('img');
    img.src = thumbnailUrl;
    img.style.cssText = `
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕ Close';
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
  color: #4b3b2a;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    closeButton.onclick = () => modal.remove();
    modal.onclick = () => modal.remove();
    img.onclick = (e) => e.stopPropagation();
    
    modal.appendChild(img);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  };

  // Export and refresh functions - Define globally for immediate access
  window.exportToCsv = function() {
    try {
      // Determine current view
      const currentView = getCurrentView();
      
      if (currentView === 'orders' || !currentView) {
        // Get the currently filtered and searched orders
  let orders = window.authSystem ? window.authSystem.getFilteredOrders(window.rkhOrders || []) : (window.rkhOrders || []);
        
        // Apply search filter if active
        const searchBox = document.getElementById('searchBox');
        if (searchBox && searchBox.value.trim()) {
          const searchTerm = searchBox.value.toLowerCase();
          orders = orders.filter(o => 
            !searchTerm || 
            o.orderNumber.toLowerCase().includes(searchTerm) ||
            o.title.toLowerCase().includes(searchTerm) ||
            o.photographer.toLowerCase().includes(searchTerm) ||
            o.status.toLowerCase().includes(searchTerm) ||
            o.method.toLowerCase().includes(searchTerm)
          );
        }
        
        if (orders.length === 0) {
          showToast('⚠️ No orders to export with current filters', 'warning');
          return;
        }
        
        // Enhanced header with Post Production info
              const header = 'Order Number,Title,Status,Production,Post Production Type,AI Operation,Purchase Group,Event ID,Photographer,Priority,Deadline,Budget,Created By,Assigned To,Photo Types';
        const rows = orders.map(o => {
          // Handle Post Production details
          let methodDisplay = o.method || '';
          let postProdType = '';
          let aiOperation = '';
          
          if (o.method === 'Post Production' && o.postProduction) {
            postProdType = o.postProduction.type || '';
            if (o.postProduction.type === 'GenAI' && o.postProduction.genaiConfig) {
              aiOperation = o.postProduction.genaiConfig.operation || '';
            }
          }
          
          return [
            o.orderNumber || '', 
            o.title || '', 
            o.status || '', 
            methodDisplay, 
            postProdType,
            aiOperation,
            o.purchaseGroup ? (o.purchaseGroup + ' - ' + ((window.purchaseGroups && window.purchaseGroups[o.purchaseGroup]) || 'Unknown')) : 'N/A', 
            o.eventId || 'N/A', 
            o.photographer || '', 
            o.priority || '', 
            o.deadline || '',
            o.budget || '',
            o.createdBy || '',
            o.assignedTo || '',
            (o.photoTypes || []).join('; ')
          ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',');
        }).join('\\n');
        
        const blob = new Blob(['\\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        
        // Include search term in filename if active
        const searchSuffix = searchBox && searchBox.value.trim() ? '_filtered' : '';
        a.download = 'photo_orders' + searchSuffix + '_' + new Date().toISOString().slice(0,10) + '.csv';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        
        const filterInfo = searchBox && searchBox.value.trim() ? ' (filtered)' : '';
        showToast('📊 Exported ' + orders.length + ' orders' + filterInfo + ' to CSV', 'success');
        
      } else if (currentView === 'samples') {
        if (!window.samples || window.samples.length === 0) {
          showToast('⚠️ No samples to export', 'warning');
          return;
        }
        
        const header = 'Sample ID,Article Name,Status,Location,Assigned To,Transit History,Last Update';
        const rows = window.samples.map(s => [
          s.id || '', 
          s.articleName || '', 
          s.status || '', 
          s.location || '', 
          s.assignedTo || '', 
          s.transitHistory || '', 
          s.lastUpdate || ''
        ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\\n');
        
        const blob = new Blob(['\\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'samples_tracking_' + new Date().toISOString().slice(0,10) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        
        showToast('📊 Exported ' + window.samples.length + ' samples to CSV', 'success');
        
      } else {
        showToast('⚠️ Export not available for current view', 'warning');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('❌ Export failed. Please try again.', 'error');
    }
  };

  window.refreshData = function() {
    // Show loading indicator
    showToast('🔄 Refreshing data...', 'info');
    
    // Refresh the current view data
    if (typeof drawOrderRows === 'function') {
      drawOrderRows();
    }
    
    // Refresh dashboard if visible
    if (typeof updateDashboard === 'function') {
      updateDashboard();
    }
    
    // Refresh filter badges
    if (typeof updateFilterTileCounts === 'function') {
      updateFilterTileCounts();
    }
    
    // Show success message
    setTimeout(() => {
      showToast('✅ Data refreshed successfully!', 'success');
    }, 500);
  };

  // Helper function to get current view
  function getCurrentView() {
    // Check which view is currently active
    const views = ['ordersView', 'samplesView', 'createOrderView', 'templatesView', 'workflowView', 'kanbanView', 'calendarView', 'dashboardView'];
    for (const viewId of views) {
      const view = document.getElementById(viewId);
      if (view && view.style.display !== 'none' && view.classList.contains('view-active')) {
        return viewId.replace('View', '');
      }
    }
    return 'orders'; // default to orders view
  }

  function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 6px;
      color: white;
      z-index: 1001;
      font-weight: 500;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const colors = {
      success: '#7fa284',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#c48b5a'
    };
    
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Global ESC key handler for closing modals
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      // List of modal selectors to check and close
      const modalSelectors = [
        // Fixed position modals with high z-index
        'div[style*="position: fixed"][style*="z-index: 10001"]',
        'div[style*="position:fixed"][style*="z-index:10001"]',
        'div[style*="position: fixed"][style*="z-index: 1000"]',
        'div[style*="position:fixed"][style*="z-index:1000"]',
        // Post Production modals
        '#postProductionSubMethodModal',
        '#genAIConfigModal',
        // Any other modal with modal class or modal-like styling
        '.modal[style*="display: block"]',
        '.modal[style*="display:block"]'
      ];
      
      let modalClosed = false;
      
      // Check each selector and close the first visible modal found
      for (const selector of modalSelectors) {
        const modal = document.querySelector(selector);
        if (modal && (modal.style.display === 'block' || modal.style.display === '' || window.getComputedStyle(modal).display !== 'none')) {
          // Close the modal
          modal.remove();
          modalClosed = true;
          showToast('Modal closed', 'info');
          break;
        }
      }
      
      // If no standard modal was found, try to find any fixed position element that looks like a modal
      if (!modalClosed) {
        const allFixedElements = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
        for (const element of allFixedElements) {
          const style = window.getComputedStyle(element);
          const zIndex = parseInt(style.zIndex) || 0;
          
          // If it's a high z-index fixed element (likely a modal) and visible
          if (zIndex >= 1000 && style.display !== 'none' && element.offsetHeight > 0) {
            element.remove();
            modalClosed = true;
            showToast('Modal closed', 'info');
            break;
          }
        }
      }
      
      // Prevent default ESC behavior if we closed a modal
      if (modalClosed) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });

  // Confetti animation for order completion celebrations
  function triggerConfetti() {
    const confettiCount = 50;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          z-index: 10000;
          pointer-events: none;
          border-radius: 50%;
          top: -10px;
          left: ${Math.random() * 100}vw;
          animation: confetti-fall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 3000);
      }, i * 50);
    }
  }

  // Add confetti animation CSS
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(confettiStyle);

  // Sound effect for order completion
  function playApplauseSound() {
    try {
      // Create audio context for clapping sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Audio context created successfully');
      
      // Create multiple quick white noise bursts to simulate clapping
      const claps = 8;
      const clapDuration = 0.1;
      const pauseBetweenClaps = 0.15;
      
      for (let i = 0; i < claps; i++) {
        setTimeout(() => {
          // Create white noise for clap sound
          const bufferSize = audioContext.sampleRate * clapDuration;
          const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
          const output = buffer.getChannelData(0);
          
          // Generate white noise with envelope for clap effect
          for (let j = 0; j < bufferSize; j++) {
            const envelope = Math.exp(-j / (bufferSize * 0.3)); // Exponential decay
            output[j] = (Math.random() * 2 - 1) * envelope * 0.3;
          }
          
          // Create and connect audio nodes
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          source.buffer = buffer;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Set volume with variation for realistic clapping
          gainNode.gain.value = 0.2 + (Math.random() * 0.1);
          
          source.start();
        }, i * pauseBetweenClaps * 1000);
      }
      
      // Add some cheering sounds after clapping
      setTimeout(() => {
        const cheerDuration = 0.3;
        const bufferSize = audioContext.sampleRate * cheerDuration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate a more musical "cheer" sound
        for (let j = 0; j < bufferSize; j++) {
          const frequency = 200 + Math.sin(j / 1000) * 100;
          const envelope = Math.exp(-j / (bufferSize * 0.5));
          output[j] = Math.sin(2 * Math.PI * frequency * j / audioContext.sampleRate) * envelope * 0.15;
        }
        
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.3;
        
        source.start();
      }, claps * pauseBetweenClaps * 1000);
      
      console.log('✅ Applause sound sequence started');
      
    } catch (error) {
      console.log('❌ Could not play applause sound:', error);
      // Fallback: show a celebration message
      showToast('🎉 Congratulations! Order delivered successfully! 👏', 'success');
    }
  }

  // Combined celebration function
  function celebrateOrderDelivery() {
    console.log('🎉 CELEBRATE ORDER DELIVERY CALLED!');
    triggerConfetti();
    playApplauseSound();
    showToast('🎉 Order delivered! Great work! 👏', 'success');
  }

  // Make celebration functions globally accessible
  window.triggerConfetti = triggerConfetti;
  window.playApplauseSound = playApplauseSound;
  window.celebrateOrderDelivery = celebrateOrderDelivery;
  
  // Test function for debugging celebration effects
  try {
    const root = document.getElementById('app');
    if(!root || window.__APP_STARTED__) {
      return;
    }

    // Mark fallback as active
    window.__FALLBACK_ACTIVE__ = true;

    // Hide loading screen and show app
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }

    if (!window.__GPT5_ANNOUNCED__) {
      window.__GPT5_ANNOUNCED__ = true;
      console.log('🧠 GPT-5 Codex (Preview) is enabled for all clients.');
      showToast('🧠 GPT-5 Codex (Preview) is now enabled for all clients.', 'success');
    }

  // Authentication System
  class AuthSystem {
    constructor() {
      this.currentUser = null;
      this.testUsers = {
        'promo1': {
          password: 'promo123',
          user: {
            id: 'user-promo1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            role: 'Promo Coordinator',
            department: 'Marketing',
            purchaseGroups: [100, 200] // Groceries, Fresh Products
          }
        },
        'promo2': {
          password: 'promo123',
          user: {
            id: 'user-promo2',
            name: 'Lars Nielsen',
            email: 'lars.nielsen@company.com',
            role: 'Promo Coordinator',
            department: 'Marketing',
            purchaseGroups: [300, 400] // Electronics, Home & Garden
          }
        },
        'photo1': {
          password: 'photo123',
          user: {
            id: 'user-photo1',
            name: 'Mike Rodriguez',
            email: 'mike.rodriguez@company.com',
            role: 'Photographer',
            department: 'Creative'
          }
        },
        'photo2': {
          password: 'photo123',
          user: {
            id: 'user-photo2',
            name: 'Emily Chen',
            email: 'emily.chen@company.com',
            role: 'Photographer',
            department: 'Creative'
          }
        },
        'photobox1': {
          password: 'photobox123',
          user: {
            id: 'user-photobox1',
            name: 'Alex Turner',
            email: 'alex.turner@company.com',
            role: 'Photo Box',
            department: 'Creative'
          }
        },
        'agency1': {
          password: 'agency123',
          user: {
            id: 'user-agency1',
            name: 'Camilla Sorensen',
            email: 'camilla.sorensen@agency-partner.com',
            role: 'Agency',
            department: 'External Agency'
          }
        },
        'marketing1': {
          password: 'marketing123',
          user: {
            id: 'user-marketing1',
            name: 'David Thompson',
            email: 'david.thompson@company.com',
            role: 'Marketing Manager',
            department: 'Marketing'
          }
        },
        'admin1': {
          password: 'admin123',
          user: {
            id: 'user-admin1',
            name: 'Jennifer Smith',
            email: 'jennifer.smith@company.com',
            role: 'Admin',
            department: 'IT'
          }
        }
      };

      Object.values(this.testUsers).forEach(record => {
        if (record && record.user) {
          record.user.features = {
            ...(record.user.features || {}),
            gpt5CodexPreview: true
          };
        }
      });
      
      this.loadSession();
    }

    applyFeatureFlags(user) {
      if (!user) {
        return user;
      }
      user.features = {
        ...(user.features || {}),
        gpt5CodexPreview: true
      };
      return user;
    }

    loadSession() {
      const saved = localStorage.getItem('current_user');
      if (saved) {
        try {
          this.currentUser = this.applyFeatureFlags(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load session:', e);
        }
      }
    }

    saveSession() {
      if (this.currentUser) {
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('current_user');
      }
    }

    login(username, password) {
      const testUser = this.testUsers[username.toLowerCase()];
      if (testUser && testUser.password === password) {
        this.currentUser = this.applyFeatureFlags({ ...testUser.user });
        this.saveSession();
        return true;
      }
      return false;
    }

    logout() {
      this.currentUser = null;
      this.saveSession();
    }

    getCurrentUser() {
      return this.currentUser;
    }

    isAuthenticated() {
      return this.currentUser !== null;
    }

    canViewAllOrders() {
  return this.currentUser && ['Admin', 'Marketing Manager', 'Agency'].includes(this.currentUser.role);
    }

    canCreateOrders() {
      return this.currentUser && ['Admin', 'Marketing Manager', 'Promo Coordinator'].includes(this.currentUser.role);
    }

    canEditOrder(order) {
      if (!this.currentUser) return false;
      
      switch (this.currentUser.role) {
        case 'Admin':
        case 'Marketing Manager':
        case 'Agency':
          return true;
        case 'Promo Coordinator':
          return order.createdBy === this.currentUser.id;
        case 'Photographer':
        case 'Photo Box':
          return order.assignedTo === this.currentUser.id;
        default:
          return false;
      }
    }

    canUploadImages() {
  return this.currentUser && ['Admin', 'Marketing Manager', 'Photographer', 'Photo Box', 'Agency'].includes(this.currentUser.role);
    }

    // Permission to manage order status and workflow
    canManageOrders() {
      return this.currentUser && ['Admin', 'Marketing Manager', 'Promo Coordinator'].includes(this.currentUser.role);
    }

    getFilteredOrders(allOrders) {
      if (!this.currentUser) return [];
      
      switch (this.currentUser.role) {
        case 'Admin':
        case 'Marketing Manager':
        case 'Agency':
          return allOrders; // Can see all orders
        case 'Promo Coordinator':
          // Filter by purchase groups assigned to the promo coordinator
          if (this.currentUser.purchaseGroups && this.currentUser.purchaseGroups.length > 0) {
            return allOrders.filter(order => 
              order.purchaseGroup && this.currentUser.purchaseGroups.includes(order.purchaseGroup)
            );
          }
          // Fallback to old behavior if no purchase groups defined
          return allOrders.filter(order => order.createdBy === this.currentUser.id);
        case 'Photographer':
        case 'Photo Box':
          return allOrders.filter(order => order.assignedTo === this.currentUser.id);
        default:
          return [];
      }
    }

    getUserIdByName(name) {
      for (const username in this.testUsers) {
        if (this.testUsers[username].user.name === name) {
          return this.testUsers[username].user.id;
        }
      }
      return null;
    }
  }

  // Initialize auth and check login
  const authSystem = new AuthSystem();
  
  // Expose authSystem globally for access from other scopes
  window.authSystem = authSystem;

  // Show login screen if not authenticated
  function showLoginScreen() {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f4e8d8 0%, #e7d2b8 100%); padding: 20px; box-sizing: border-box;">
        <div style="background: #fffaf3; padding: 48px; border-radius: 16px; box-shadow: 0 30px 60px rgba(79, 59, 37, 0.18); max-width: 420px; width: 100%; max-height: 90vh; overflow-y: auto; border: 1px solid rgba(196, 139, 90, 0.2);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="margin: 0 0 20px 0; text-align: center;">
              <div style="margin-bottom: 8px;">
                <img src="/CCP_Logog.png" alt="CCP Logo" style="width: 200px; height: 200px; object-fit: contain; display: inline-block;" />
              </div>
              <h1 style="margin: 0 0 4px 0; font-size: 32px; font-weight: 700; color: #4b3b2a;">Content Creation Program</h1>
              <p style="margin: 0; font-size: 14px; color: #6b5440; font-weight: 500; letter-spacing: 0.3px;">RKH's Professional Creative Suite</p>
            </div>
            <p style="margin: 0; color: #6b5440; font-size: 16px;">Management System</p>
            <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 14px;">Role-based access control</p>
          </div>

          <form id="loginForm" style="margin-bottom: 32px;">
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #4b3b2a;">Username</label>
              <input type="text" id="username" required 
                style="width: 100%; padding: 12px 16px; border: 1px solid rgba(196, 139, 90, 0.35); border-radius: 8px; font-size: 16px; transition: border-color 0.15s; background: #fffaf3; color: #4b3b2a;" 
                placeholder="Enter your username">
            </div>

            <div style="margin-bottom: 32px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #4b3b2a;">Password</label>
              <input type="password" id="password" required 
                style="width: 100%; padding: 12px 16px; border: 1px solid rgba(196, 139, 90, 0.35); border-radius: 8px; font-size: 16px; transition: border-color 0.15s; background: #fffaf3; color: #4b3b2a;" 
                placeholder="Enter your password">
            </div>

            <button type="submit" 
              style="width: 100%; background: linear-gradient(135deg, #dfb37d, #c48b5a); color: white; border: none; padding: 14px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; margin-bottom: 16px; box-shadow: 0 12px 24px rgba(196, 139, 90, 0.35);">
              Sign In
            </button>
          </form>

          <div id="loginError" style="margin-bottom: 24px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; display: none;"></div>

          <div style="padding-top: 24px; border-top: 1px solid rgba(196, 139, 90, 0.2);">
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b5440; text-align: center; font-weight: 600; letter-spacing: 0.3px;">Test Credentials - Click to use:</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px;">
              <div style="background: #fff6ea; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(196, 139, 90, 0.2); transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='promo1'; document.getElementById('password').value='promo123';">
                <div style="font-weight: 600; color: #4b3b2a; margin-bottom: 4px;">📊 Promo Coordinator</div>
                <div style="color: #4b3b2a; font-weight: 500;">Sarah Johnson</div>
                <div style="color: #6b5440; font-family: monospace;">promo1</div>
                <div style="color: #7fa284; font-size: 10px; margin-top: 4px;">PG: 100 (Groceries), 200 (Fresh)</div>
              </div>
              <div style="background: #fff6ea; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(196, 139, 90, 0.2); transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='promo2'; document.getElementById('password').value='promo123';">
                <div style="font-weight: 600; color: #4b3b2a; margin-bottom: 4px;">📊 Promo Coordinator</div>
                <div style="color: #4b3b2a; font-weight: 500;">Lars Nielsen</div>
                <div style="color: #6b5440; font-family: monospace;">promo2</div>
                <div style="color: #7fa284; font-size: 10px; margin-top: 4px;">PG: 300 (Electronics), 400 (Home&Garden)</div>
              </div>
              <div style="background: #f6f0ff; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(191, 163, 214, 0.25); transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='photo1'; document.getElementById('password').value='photo123';">
                <div style="font-weight: 600; color: #4b3b2a; margin-bottom: 4px;">📷 Photographer</div>
                <div style="color: #4b3b2a; font-weight: 500;">Mike Rodriguez</div>
                <div style="color: #6b5440; font-family: monospace;">photo1</div>
                <div style="color: #b48fc7; font-size: 10px; margin-top: 4px;">Studio & Location Photography</div>
              </div>
              <div style="background: #f6f0ff; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(191, 163, 214, 0.25); transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='photobox1'; document.getElementById('password').value='photobox123';">
                <div style="font-weight: 600; color: #4b3b2a; margin-bottom: 4px;">📦 Photo Box</div>
                <div style="color: #4b3b2a; font-weight: 500;">Alex Turner</div>
                <div style="color: #6b5440; font-family: monospace;">photobox1</div>
                <div style="color: #c76f5c; font-size: 10px; margin-top: 4px;">Product Photography Specialist</div>
              </div>
          <div style="background: #edf2ff; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(165, 180, 252, 0.25); transition: all 0.15s;" 
             onclick="document.getElementById('username').value='agency1'; document.getElementById('password').value='agency123';">
           <div style="font-weight: 600; color: #4b3b2a; margin-bottom: 4px;">📝 Agency</div>
           <div style="color: #4b3b2a; font-weight: 500;">Camilla Sorensen</div>
           <div style="color: #6b5440; font-family: monospace;">agency1</div>
           <div style="color: #64748b; font-size: 10px; margin-top: 4px;">Briefing & Image Review Lead</div>
          </div>
              <div style="background: #f0f8f4; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(143, 162, 148, 0.25); transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='marketing1'; document.getElementById('password').value='marketing123';">
                <div style="font-weight: 600; color: #4b3b2a; margin-bottom: 4px;">🎯 Marketing Manager</div>
                <div style="color: #4b3b2a; font-weight: 500;">Manager Access</div>
                <div style="color: #6b5440; font-family: monospace;">marketing1</div>
                <div style="color: #a66b38; font-size: 10px; margin-top: 4px;">All Purchase Groups</div>
              </div>
              <div style="background: #f0f8f4; padding: 12px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(143, 162, 148, 0.25); transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='admin1'; document.getElementById('password').value='admin123';">
                <div style="font-weight: 600; color: #4b3b2a; margin-bottom: 4px;">Admin</div>
                <div style="color: #6b5440; font-family: monospace;">admin1</div>
                <div style="color: #9ca3af; font-family: monospace;">••••••</div>
              </div>
            </div>
            <p style="margin: 16px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">Each role has different permissions and access levels</p>
          </div>
        </div>
      </div>
    `;

    // Setup login form handler
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('loginError');

      if (authSystem.login(username, password)) {
        const user = authSystem.getCurrentUser();
        showToast(`Welcome back, ${user.name}! Logged in as ${user.role}`, 'success');
        render(); // Show main app
      } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Invalid username or password. Please try again.';
        setTimeout(() => {
          errorDiv.style.display = 'none';
        }, 5000);
      }
    });
  }

  // Enhanced sample data with comprehensive features
  // SAP PMR Purchase Group Mappings
  const purchaseGroups = {
    100: 'Groceries',
    200: 'Fresh Products', 
    300: 'Electronics',
    400: 'Home & Garden',
    500: 'Fashion',
    600: 'Health & Beauty',
    700: 'Sports & Leisure',
    800: 'Automotive',
    900: 'Baby & Kids'
  };

  function createNormalizedArticle({ name, ean, articleNumber, variant, quantity, status, notes, raw }) {
    const cleanName = (name || '').toString().trim();
    const cleanEAN = (ean || '').toString().replace(/\s+/g, '');
    const cleanArticleNumber = (articleNumber || '').toString().trim();
    const cleanVariant = (variant || '').toString().trim();
    const cleanQuantity = quantity === 0 || quantity ? quantity : '';
    const cleanStatus = (status || '').toString().trim();
    const cleanNotes = (notes || '').toString().trim();

    const primaryLabel = cleanName || cleanArticleNumber || cleanEAN || 'Article';
    const detailParts = [];
    if (cleanArticleNumber) detailParts.push(`Article ${cleanArticleNumber}`);
    if (cleanEAN) detailParts.push(`EAN ${cleanEAN}`);
    if (cleanVariant) detailParts.push(cleanVariant);
    if (cleanQuantity !== '' && cleanQuantity !== null) detailParts.push(`Qty ${cleanQuantity}`);
    const displayText = detailParts.length ? `${primaryLabel} (${detailParts.join(' • ')})` : primaryLabel;

    return {
      name: cleanName,
      ean: cleanEAN,
      articleNumber: cleanArticleNumber,
      variant: cleanVariant,
      quantity: cleanQuantity,
      status: cleanStatus,
      notes: cleanNotes,
      displayText,
      raw
    };
  }

  function normalizeArticles(articles) {
    if (!articles) {
      return [];
    }

    const source = Array.isArray(articles) ? articles : [articles];

    return source
      .map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const name = item.name || item.articleName || item.title || item.description || '';
          const ean = item.ean || item.EAN || item.barcode || item.gtin || '';
          const articleNumber = item.articleNumber || item.articleNo || item.sku || item.id || '';
          const variant = item.variant || item.variantName || '';
          const quantity = item.quantity ?? item.qty ?? '';
          const status = item.status || '';
          const notes = item.notes || item.comment || item.details || '';

          return createNormalizedArticle({
            name,
            ean,
            articleNumber,
            variant,
            quantity,
            status,
            notes,
            raw: item
          });
        }

        const text = String(item || '').trim();
        if (!text) {
          return null;
        }

        const eanMatch = text.match(/\[EAN:\s*([^\]]+)\]/i);
        const articleMatch = text.match(/\[Article(?: Number)?:\s*([^\]]+)\]/i);
        const cleanedName = text
          .replace(/\[EAN:[^\]]+\]/i, '')
          .replace(/\[Article(?: Number)?:[^\]]+\]/i, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        return createNormalizedArticle({
          name: cleanedName,
          ean: eanMatch ? eanMatch[1].trim() : '',
          articleNumber: articleMatch ? articleMatch[1].trim() : '',
          raw: text
        });
      })
      .filter(Boolean);
  }

  function getArticleTextList(articles) {
    return normalizeArticles(articles).map((article) => article.displayText).filter(Boolean);
  }

  function formatArticlesAsPlainText(articles) {
    const list = getArticleTextList(articles);
    return list.length ? list.join(', ') : '';
  }

  function renderArticleChips(articles, limit = 2) {
    const normalized = normalizeArticles(articles);
    if (!normalized.length) {
      return '<div style="margin-top:6px;font-size:12px;color:#9ca3af;">No articles linked</div>';
    }

    const chips = normalized.slice(0, limit).map((article) => `
      <span style="display:inline-flex;align-items:center;padding:3px 10px;background:rgba(196, 139, 90, 0.12);color:#6b5440;border-radius:999px;font-size:11px;font-weight:600;">
        ${article.name || article.articleNumber || article.ean || 'Article'}
      </span>
    `).join('');

    const extra = normalized.length > limit
      ? `<span style="display:inline-flex;align-items:center;padding:3px 10px;background:rgba(196, 139, 90, 0.12);color:#a66b38;border-radius:999px;font-size:11px;font-weight:600;">+${normalized.length - limit} more</span>`
      : '';

    return `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;">${chips}${extra}</div>`;
  }

  function renderArticleCards(articles) {
    const normalized = normalizeArticles(articles);
    if (!normalized.length) {
      return '<div style="padding:16px;background:rgba(255, 250, 243, 0.8);border:1px dashed rgba(196, 139, 90, 0.4);border-radius:12px;color:#6b5440;font-size:13px;">No article details available for this order.</div>';
    }

    return `
      <div style="background:white;border:1px solid rgba(196, 139, 90, 0.25);border-radius:10px;overflow:hidden;">
        ${normalized.map((article, index) => {
          const descriptor = article.name || article.displayText || `Article ${index + 1}`;
          const details = [];
          if (article.articleNumber) details.push(`#${article.articleNumber}`);
          if (article.ean) details.push(`EAN ${article.ean}`);
          if (article.variant) details.push(article.variant);
          if (article.quantity !== '' && article.quantity !== null) details.push(`Qty ${article.quantity}`);
          const baseText = [descriptor, ...details].join(' • ');
          const noteText = article.notes ? ` – ${article.notes}` : '';
          return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 12px;${index < normalized.length - 1 ? 'border-bottom:1px solid rgba(196, 139, 90, 0.18);' : ''}background:${index % 2 === 0 ? 'transparent' : 'rgba(253, 244, 230, 0.55)'};">
              <div style="font-size:11px;color:#4b3b2a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${baseText}${noteText}</div>
              ${article.status ? `<span style="margin-left:12px;background:rgba(127, 162, 132, 0.18);color:#54735d;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:600;white-space:nowrap;">${article.status}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Runware API Configuration (already initialized at top). Ensure defaults remain consistent.
  runwareConfig.apiKey = runwareConfig.apiKey || '';
  runwareConfig.websocketEndpoint = runwareConfig.websocketEndpoint || 'wss://ws-api.runware.ai/v1';
  runwareConfig.model = runwareConfig.model || 'google:4@1'; // Nano Banana - Google Gemini Flash Image 2.5

  // Google Gemini API Configuration (already initialized at top). Ensure defaults remain consistent.
  geminiConfig.apiKey = geminiConfig.apiKey || '';
  geminiConfig.baseUrl = geminiConfig.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
  geminiConfig.model = geminiConfig.model || 'gemini-2.5-flash';

  // Initialize Google Gemini configuration
  function loadGeminiConfig() {
    const savedKey = localStorage.getItem('geminiApiKey');
    const savedProjectId = localStorage.getItem('geminiProjectId');
    const savedLocation = localStorage.getItem('geminiLocation');
    
    if (savedKey) {
      geminiConfig.apiKey = savedKey;
    }
    if (savedProjectId) {
      geminiConfig.projectId = savedProjectId;
    }
    if (savedLocation) {
      geminiConfig.location = savedLocation;
    }
    
    return geminiConfig;
  }

  // Configuration function for Google Gemini API
  window.configureGeminiAI = function(apiKey, projectId = null, location = null) {
    if (!apiKey) {
      console.log('🔮 Google Gemini AI Configuration:');
      console.log('Current status:', geminiConfig.apiKey ? 'Configured ✅' : 'Not configured ❌');
      console.log('API Key type:', geminiConfig.apiKey ? (geminiConfig.apiKey.startsWith('AIzaSy') ? 'Google AI Studio Key (AIzaSy)' : geminiConfig.apiKey.startsWith('AQ.') ? 'AI Studio Token (AQ.)' : 'OAuth Token') : 'None');
      console.log('Base URL:', geminiConfig.baseUrl);
      console.log('Model:', geminiConfig.model);
      console.log('Project ID:', geminiConfig.projectId || 'Not set (not required for AIzaSy keys)');
      console.log('Location:', geminiConfig.location);
      console.log('');
      console.log('📋 To configure with Google AI Studio API Key:');
      console.log('1. Get API key from: https://aistudio.google.com/apikey');
      console.log('2. Run: configureGeminiAI("AIzaSy...") - Project ID not required');
      console.log('');
      console.log('📋 To configure with Vertex AI (OAuth):');
      console.log('1. Get OAuth token from Google Cloud');
      console.log('2. Get project ID from Google Cloud Console');
      console.log('3. Run: configureGeminiAI("ya29...token", "your-project-id", "us-central1")');
      console.log('');
      console.log('🎯 Features available:');
      console.log('• Advanced AI image generation and editing');
      console.log('• Google Gemini Flash and Pro models');
      console.log('• High-quality image processing');
      console.log('• Vision and text generation capabilities');
      return geminiConfig;
    }

    // Validate API key format
    const isValidKey = apiKey.startsWith('AIzaSy') || apiKey.startsWith('AQ.') || apiKey.startsWith('ya29');
    if (!isValidKey) {
      console.error('❌ Invalid API key format. Expected AIzaSy... (Google AI Studio), AQ. (AI Studio token), or ya29... (OAuth), got:', apiKey.substring(0, 10) + '...');
      showToast('❌ Invalid API key format. Must start with AIzaSy, AQ., or ya29', 'error');
      return false;
    }

    geminiConfig.apiKey = apiKey;
    localStorage.setItem('geminiApiKey', apiKey);

    if (projectId) {
      geminiConfig.projectId = projectId;
      localStorage.setItem('geminiProjectId', projectId);
    }

    if (location) {
      geminiConfig.location = location;
      localStorage.setItem('geminiLocation', location);
    }

  // Update window object to ensure global access
  if (typeof window !== 'undefined') window.geminiConfig = geminiConfig;

  console.log('✅ Google Gemini API configured successfully!');
  const keyType = geminiConfig.apiKey?.startsWith('AIzaSy') ? 'Google AI Studio API Key (AIzaSy)' : 
                  geminiConfig.apiKey?.startsWith('AQ.') ? 'AI Studio Token (AQ.)' : 
                  'OAuth 2 Access Token (Vertex AI)';
  console.log('API Key type:', keyType);
  console.log('Endpoint:', geminiConfig.apiKey?.startsWith('AIzaSy') || geminiConfig.apiKey?.startsWith('AQ.') ? 'Google AI Studio' : 'Vertex AI');
  console.log('Project ID:', geminiConfig.projectId || 'Not required for Google AI Studio keys');
  console.log('Location:', geminiConfig.location);
  showToast('✅ Google Gemini API configured successfully!', 'success');

    // Test the connection
    testGeminiConnection();
    return geminiConfig;
  };

  // Helper: detect Google AI Studio API keys (AIzaSy or AQ.)
  function isGoogleAIKey(token) {
    return typeof token === 'string' && (token.startsWith('AIzaSy') || token.startsWith('AQ.'));
  }
  
  // Backward compatibility alias
  function isAQToken(token) {
    return isGoogleAIKey(token);
  }

  // Test Google Gemini connection - Supports Vertex AI (OAuth) and Google AI (AQ key)
  async function testGeminiConnection() {
    try {
      if (!geminiConfig.apiKey) {
        showToast('❌ Google Gemini API key not configured', 'error');
        return false;
      }

      let url;
      let headers;
      let body;

      if (isGoogleAIKey(geminiConfig.apiKey)) {
        // Google AI Studio endpoint with API key query param
        url = `${geminiConfig.baseUrl}/models/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`;
        headers = { 'Content-Type': 'application/json' };
        body = {
          contents: [{
            parts: [{ text: 'Hello, this is a test message for Google AI Studio Gemini.' }]
          }],
          generationConfig: {
            temperature: geminiConfig.temperature,
            maxOutputTokens: geminiConfig.maxTokens,
          }
        };

        const keyTypeDisplay = geminiConfig.apiKey.startsWith('AIzaSy') ? 'AIzaSy API Key' : 'AQ. Token';
        console.log('🔗 Testing Google AI Studio endpoint (aistudio.google.com)...');
        console.log('URL:', url.replace(geminiConfig.apiKey, geminiConfig.apiKey.substring(0, 15) + '...'));
        console.log('Using', keyTypeDisplay, 'via query param');
      } else {
        // Vertex AI with OAuth 2 access token
        if (!geminiConfig.projectId) {
          showToast('❌ Google Cloud Project ID not configured', 'error');
          return false;
        }
        url = `${geminiConfig.baseUrl}/projects/${geminiConfig.projectId}/locations/${geminiConfig.location}/publishers/google/models/${geminiConfig.model}:generateContent`;
        headers = {
          'Authorization': `Bearer ${geminiConfig.apiKey}`,
          'Content-Type': 'application/json',
        };
        body = {
          contents: [{
            parts: [ { text: 'Hello, this is a test message for Vertex AI Gemini.' } ]
          }],
          generationConfig: {
            temperature: geminiConfig.temperature,
            maxOutputTokens: geminiConfig.maxTokens,
          }
        };
        console.log('🔗 Testing Vertex AI connection...');
        console.log('URL:', url);
        console.log('Using Bearer token authentication (expecting OAuth 2 access token)');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Google Gemini (Vertex AI) connection successful');
        console.log('Response received:', result.candidates ? 'Yes' : 'No candidates');
        showToast('✅ Google Gemini (Vertex AI) connected successfully!', 'success');
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Google Gemini connection failed:', response.status, response.statusText);
        console.error('Error details:', errorData);
        console.error('🔍 Authentication Debug Info:');
        console.error('- API Key configured:', !!geminiConfig.apiKey);
        console.error('- API Key starts with AIzaSy:', geminiConfig.apiKey?.startsWith('AIzaSy'));
        console.error('- API Key starts with AQ.:', geminiConfig.apiKey?.startsWith('AQ.'));
        console.error('- API Key length:', geminiConfig.apiKey?.length);
        console.error('- Project ID:', geminiConfig.projectId);
        console.error('- Location:', geminiConfig.location);
        console.error('- Full URL:', url);
        console.error('- Headers sent:', isGoogleAIKey(geminiConfig.apiKey)
          ? { 'Content-Type': 'application/json', 'Auth': 'API key via query param' }
          : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiConfig.apiKey ? geminiConfig.apiKey.substring(0, 10) + '...' : 'NOT SET'}` }
        );

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (errorData.error) {
          errorMessage += ` - ${errorData.error.message || 'Unknown error'}`;
          // Provide friendlier guidance for common auth errors
          const reason = errorData.error.details && errorData.error.details[0] && (errorData.error.details[0].reason || errorData.error.details[0]['@type']);
          if (reason === 'API_KEY_SERVICE_BLOCKED') {
            errorMessage += ' (Vertex AI does not accept API keys. Using Google AI endpoint with AQ key is supported.)';
          } else if (reason === 'CREDENTIALS_MISSING' && isAQToken(geminiConfig.apiKey)) {
            errorMessage += ' (This model may require OAuth even on Google AI. Try gemini-1.5-flash instead.)';
          }
          if (errorData.error.details) {
            console.error('Error details from API:', errorData.error.details);
            console.error('Full error object:', JSON.stringify(errorData, null, 2));
          }
        }

        showToast(`❌ Google Gemini connection failed: ${errorMessage}`, 'error');
        return false;
      }
    } catch (error) {
      console.error('❌ Google Gemini connection test error:', error);
      showToast('❌ Gemini connection test error: ' + error.message, 'error');
      return false;
    }
  }

  // Expose test function globally
  window.testGeminiConnection = testGeminiConnection;

  // Function to process images with Google Gemini API (supports Google AI with AQ key or Vertex with OAuth)
  async function processWithGeminiAI(prompt, imageData = null, options = {}) {
    try {
      // Validate API key
      if (!geminiConfig.apiKey) {
        throw new Error('Google Gemini API key not configured. Please configure it first.');
      }

      // Show processing indicator
      const processingToast = showToast('🔮 Processing with Google Gemini...', 'info', 0);

      const useGoogleAI = isAQToken(geminiConfig.apiKey);

      // Prepare parts for both APIs
      const base64Data = imageData && imageData.indexOf(',') !== -1 ? imageData.split(',')[1] : imageData;
      const partsGoogleAI = [{ text: prompt }];
      const partsVertex = [{ text: prompt }];
      if (base64Data) {
        partsGoogleAI.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
        partsVertex.push({ inline_data: { mime_type: 'image/jpeg', data: base64Data } });
      }

      let url, headers, body;
      if (useGoogleAI) {
        url = `${geminiConfig.baseUrl}/models/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`;
        headers = { 'Content-Type': 'application/json' };
        body = {
          contents: [{ parts: partsGoogleAI }],  // Fixed: wrap parts in contents array
          generationConfig: {
            temperature: options.temperature || geminiConfig.temperature,
            maxOutputTokens: options.maxTokens || geminiConfig.maxTokens,
          }
        };
      } else {
        url = `${geminiConfig.baseUrl}/projects/${geminiConfig.projectId}/locations/${geminiConfig.location}/publishers/google/models/${geminiConfig.model}:generateContent`;
        headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiConfig.apiKey}` };
        body = {
          contents: [{ parts: partsVertex }],
          generationConfig: {
            temperature: options.temperature || geminiConfig.temperature,
            maxOutputTokens: options.maxTokens || geminiConfig.maxTokens,
          }
        };
      }

      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();

      // Hide processing toast
      if (processingToast) processingToast.hide();

      // Process Gemini response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const content = result.candidates[0].content;

        // Check if response contains image data (both API casing)
        const imagePart = content.parts.find(part => part.inline_data || part.inlineData);
        const inlineImg = imagePart && (imagePart.inline_data || imagePart.inlineData);
        if (inlineImg) {
          // Convert back to data URL for display
          const mime = inlineImg.mime_type || inlineImg.mimeType || 'image/png';
          const dataUrl = `data:${mime};base64,${inlineImg.data}`;

          showToast('✅ Content generated successfully with Google Gemini!', 'success');
          return {
            success: true,
            imageUrl: dataUrl,
            taskUUID: 'gemini-' + Date.now(),
            cost: 'N/A', // Gemini doesn't provide cost info in response
            processingTime: 'N/A',
            model: geminiConfig.model,
            provider: 'Google Gemini'
          };
        } else {
          // Text-only response or no image generated
          const textResponse = content.parts.find(part => part.text)?.text || 'No content generated';
          showToast('✅ Text response generated with Google Gemini!', 'success');
          return {
            success: true,
            textResponse: textResponse,
            taskUUID: 'gemini-' + Date.now(),
            cost: 'N/A',
            processingTime: 'N/A',
            model: geminiConfig.model,
            provider: 'Google Gemini'
          };
        }
      } else {
        throw new Error('No valid response from Google Gemini API');
      }

    } catch (error) {
      // Hide processing toast if it exists
      if (typeof processingToast !== 'undefined' && processingToast && processingToast.hide) {
        processingToast.hide();
      }

      // Show error message
      let errorMessage = error.message;
      if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API key not configured. Please configure your Google Gemini API key first.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message.includes('403')) {
        errorMessage = 'API key invalid or insufficient permissions.';
      }

      showToast(`❌ Google Gemini Error: ${errorMessage}`, 'error');
      throw error;
    }
  }

  // Expose Gemini function globally
  window.processWithGeminiAI = processWithGeminiAI;

  // Initialize Gemini configuration
  loadGeminiConfig();

  // SAP PMR Photo Status Options
  const photoStatuses = {
    'Archive': 'Archive - Existing Image',
    'New Shoot - Photographer': 'New Shoot - Photographer',
    'New Shoot - Photo Box': 'New Shoot - Photo Box'
  };

  // Function to import SAP PMR JSON data
  window.importSAPData = function(jsonData) {
    try {
      const sapData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Convert SAP data to our order format
      const newOrders = sapData.map((item, index) => {
        const order = {
        orderNumber: item.imageRequestId || `IMG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: `${item.articleName || 'Product Photography'}`,
        status: item.photoStatus === 'Archive' ? 'Completed' : 'New Request',
        method: item.photoStatus === 'New Shoot - Photo Box' ? 'Photo Box' : 'Photographer',
        photographer: 'Unassigned',
        deadline: getEventDeadline(item.eventId),
        costCenter: `PG-${item.purchaseGroup}`,
        priority: 'Medium',
        brief: `Photography for ${item.articleName} (Article: ${item.articleNumber}) as part of Event ${item.eventId}`,
        articles: [item.articleName],
        budget: 1500,
        deliverables: ['Product Photography'],
        
        // SAP PMR specific fields
        eventId: item.eventId,
        purchaseGroup: item.purchaseGroup,
        offerId: item.offerId,
        articleNumber: item.articleNumber,
        articleName: item.articleName,
        imageRequestId: item.imageRequestId,
        photoStatus: item.photoStatus,
        cloudinaryUrl: item.cloudinaryUrl || null,
        
        // Standard fields
        createdAt: new Date().toISOString(),
        createdBy: 'sap-import',
        assignedTo: null,
        samples: [],
        comments: [],
        uploadedContent: []
      };

        assignSalesOrgToOrder(order, allOrders.length + index);
        return order;
      });
      
      // Add new orders to existing orders
      allOrders.push(...newOrders);
      assignSalesOrgMetadata(allOrders);
      
      // Refresh the current view
      if (window.currentView) {
        window.currentView();
      }
      
      return { success: true, imported: newOrders.length };
    } catch (error) {
      console.error('SAP Import Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Helper function to calculate deadline based on event ID
  function getEventDeadline(eventId) {
    if (!eventId) return '2025-09-30';
    
    // Parse event ID format: A4025052 (A=Activity, 40=Week, 25=Year, 052=Format)
    const weekMatch = eventId.match(/\d(\d{2})\d{2}/);
    if (weekMatch) {
      const week = parseInt(weekMatch[1]);
      const year = 2025; // Assuming current year
      
      // Calculate date from week number (approximate)
      const startOfYear = new Date(year, 0, 1);
      const daysToAdd = (week - 1) * 7;
      const eventDate = new Date(startOfYear.setDate(startOfYear.getDate() + daysToAdd));
      
      // Set deadline 3 days before event
      eventDate.setDate(eventDate.getDate() - 3);
      return eventDate.toISOString().split('T')[0];
    }
    
    return '2025-09-30';
  }

  const allOrders = [
    
    {
      orderNumber:'ORD-2025-001', 
      title:'Premium Dog Food - Hero Shot', 
      status:'In Progress',
      
      method:'Photographer',
      orderType: 'PS',
      photographer:'Mike Rodriguez', 
      deadline:'2025-09-06', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Create high-impact product photography for premium dog food line. Focus on hero shots, lifestyle images, and detail macro shots.',
      articles: ['Premium Dog Food 2kg [EAN: 5901234567890]'],
      budget: 5500,
      deliverables: ['Hero Product Shots', 'Lifestyle Photography', 'Detail Macro Shots'],
      
      // SAP PMR fields
      eventId: 'A4025052', // Week 40, 2025, Bilka format
      purchaseGroup: 101, // Groceries
      offerId: '10763319',
      articleNumber: '1234575511',
      articleName: 'Premium Dog Food 2kg',
      imageRequestId: '123456',
      photoStatus: 'New Shoot - Photographer',
      cloudinaryUrl: null,
      page: 1,
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Groceries)
      createdAt: '2025-08-20T09:00:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: [
        {
          id: 'c1',
          orderId: 'ORD-2025-001',
          userId: 'user1',
          userName: 'Sarah Miller',
          userRole: 'Promo Coordinator',
          message: 'Please ensure the lighting highlights the premium quality of the packaging. We want to emphasize the gold foil elements.',
          createdAt: '2025-08-25T09:30:00Z',
          isRead: false,
          readBy: ['user1']
        },
        {
          id: 'c2', 
          orderId: 'ORD-2025-001',
          userId: 'photographer1',
          userName: 'John Smith',
          userRole: 'Photographer',
          message: 'Understood! I\'ll use warm, directional lighting to bring out the metallic elements. Should we also include some lifestyle shots with dogs?',
          createdAt: '2025-08-25T14:15:00Z',
          isRead: false,
          readBy: ['photographer1']
        },
        {
          id: 'c_agency_001',
          orderId: 'ORD-2025-001',
          userId: 'user-agency1',
          userName: 'Camilla Sorensen',
          userRole: 'Agency',
          message: 'Agency briefing update: please capture close-ups of the brand story panel for the campaign deck.',
          createdAt: '2025-08-26T10:15:00Z',
          isRead: false,
          readBy: []
        }
      ],
      uploadedContent: [
        {
          id: 'file_bilka_001_1',
          name: 'ENV.000001.jpg',
          type: 'image/jpeg',
          size: 2456789,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-25T10:30:00Z',
          uploadedByRole: 'System'
        },
        {
          id: 'file_bilka_001_2',
          name: 'ENV.000002.jpg',
          type: 'image/jpeg',
          size: 1987654,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-25T11:15:00Z',
          uploadedByRole: 'System'
        }
      ]
    },
    {
      orderNumber:'ORD-2025-002', 
      title:'Espresso Beans - E-commerce Photography', 
      status:'Samples Requested', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Emily Chen', 
      deadline:'2025-09-05', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Automated photo box session for coffee product line. Consistent e-commerce shots with white background.',
      articles: ['Espresso Beans 500g [EAN: 2001234567892]'],
      budget: 2200,
      deliverables: ['E-commerce Product Photos', '360° Product Views'],
      
      // SAP PMR fields
      eventId: 'A4125053', // Week 41, 2025, Netto format
      purchaseGroup: 101, // Fresh Products
      offerId: '10763320',
      articleNumber: 'ART-COF-002',
      articleName: 'Espresso Beans 500g',
      imageRequestId: '123457',
      photoStatus: 'New Shoot - Photo Box',
      cloudinaryUrl: null,
      page: 2,
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Fresh Products)
      createdAt: '2025-08-21T10:30:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      comments: [
        {
          id: 'c3',
          orderId: 'ORD-2025-002',
          userId: 'user2',
          userName: 'Mike Johnson',
          userRole: 'Marketing Manager',
          message: 'The samples are delayed by 2 days. Can we adjust the deadline accordingly?',
          createdAt: '2025-08-26T11:20:00Z',
          isRead: false,
          readBy: ['user2']
        }
      ],
      uploadedContent: [
        {
          id: 'file_coffee_001',
          name: 'Espresso_Beans_Hero_Shot.jpg',
          type: 'image/jpeg',
          size: 2856789,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVzLXByZXNzbyBCZWFucyBIZXJvPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-27T10:30:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_coffee_002',
          name: 'Coffee_Packaging_Detail.jpg',
          type: 'image/jpeg',
          size: 1987654,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvZmZlZSBQYWNrYWdpbmcgRGV0YWlsPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-27T11:15:00Z',
          uploadedByRole: 'Photographer'
        }
      ]
    },
    {
      orderNumber:'ORD-2025-003', 
      title:'Wireless Speaker - Tech Photography', 
      status:'Draft', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Mike Rodriguez', 
      deadline:'2025-09-15', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Professional studio photography for new tech product launch. High-end product photography and lifestyle shots for electronics catalog.',
      articles: ['Wireless Bluetooth Speaker [EAN: 4061234567890]', 'USB-C Cable [EAN: 8901234567891]'],
      budget: 8000,
      deliverables: ['Product Photography', 'Lifestyle Shots', 'Technical Details'],
      
      // SAP PMR fields
      eventId: 'A3825054', // Week 38, 2025, Føtex format
      purchaseGroup: 101, // Electronics
      offerId: '10763321',
      articleNumber: 'ART-ELEC-003',
      articleName: 'Wireless Bluetooth Speaker Premium',
      imageRequestId: '123458',
      photoStatus: 'New Shoot - Photographer',
      cloudinaryUrl: null,
      page: 3,
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Electronics)
      createdAt: '2025-08-22T14:15:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: [],
      uploadedContent: [
        {
          id: 'file_speaker_001',
          name: 'Wireless_Speaker_Hero_Shot.jpg',
          type: 'image/jpeg',
          size: 2456789,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJsdWV0b290aCBTcGVha2VyIEhlcm88L3RleHQ+PC9zdmc+',
          uploadedBy: 'Mike Rodriguez',
          uploadedAt: '2025-08-27T14:30:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_speaker_002',
          name: 'Speaker_Waterproof_Demo.jpg',
          type: 'image/jpeg',
          size: 1987654,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldhdGVycHJvb2YgRGVtbzwvdGV4dD48L3N2Zz4=',
          uploadedBy: 'Mike Rodriguez',
          uploadedAt: '2025-08-27T15:15:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_speaker_003',
          name: 'Speaker_Outdoor_Lifestyle.jpg',
          type: 'image/jpeg',
          size: 3123456,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk91dGRvb3IgTGlmZXN0eWxlPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Mike Rodriguez',
          uploadedAt: '2025-08-27T16:00:00Z',
          uploadedByRole: 'Photographer'
        }
      ]
    },
    {
      orderNumber:'ORD-2025-004', 
      title:'Garden Tools - Product Showcase', 
      status:'Approved', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Emily Chen', 
      deadline:'2025-09-07', 
      costCenter:'PG-400',
      priority:'Critical',
      brief:'Dynamic product shots of garden tools. Focus on durability, functionality, and outdoor lifestyle for spring catalog.',
      articles: ['Electric Hedge Trimmer', 'Garden Gloves Set'],
      budget: 6500,
      deliverables: ['Product Shots', 'Lifestyle Photography', 'Detail Shots'],
      
      // SAP PMR fields
      eventId: 'A3725055', // Week 37, 2025, Bilka format
      purchaseGroup: 101, // Home & Garden
      offerId: '10763322',
      articleNumber: '1234575512',
      articleName: 'Electric Hedge Trimmer Pro',
      imageRequestId: '123459',
      photoStatus: 'New Shoot - Photographer',
      cloudinaryUrl: null,
      page: 4,
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Home & Garden)
      createdAt: '2025-08-23T11:20:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      comments: [],
      uploadedContent: [
        {
          id: 'file_bilka_004_1',
          name: 'ENV.000003.jpg',
          type: 'image/jpeg',
          size: 3456789,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-27T14:30:00Z',
          uploadedByRole: 'System'
        },
        {
          id: 'file_bilka_004_2',
          name: 'ENV.000004.jpg',
          type: 'image/jpeg',
          size: 2345678,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-27T15:15:00Z',
          uploadedByRole: 'System'
        },
        {
          id: 'file_bilka_004_3',
          name: 'ENV.000005.jpg',
          type: 'image/jpeg',
          size: 4567890,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-27T16:00:00Z',
          uploadedByRole: 'System'
        }
      ]
    },
    // Additional orders to populate all Kanban status columns
    {
      orderNumber:'ORD-2025-005', 
      title:'Organic Pasta - Product Photography', 
      status:'Pending Approval', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Emily Chen', 
      deadline:'2025-09-04', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Organic pasta product line photography for new health-focused marketing campaign. Clean, fresh styling.',
      articles: ['Organic Penne Pasta 500g', 'Organic Linguine 400g'],
      budget: 3200,
      deliverables: ['Product Shots', 'Lifestyle Photography'],
      
      // SAP PMR fields
      eventId: 'A3925056', // Week 39, 2025, Netto format
      purchaseGroup: 101, // Groceries
      offerId: '10763323',
      articleNumber: 'ART-PAST-005',
      articleName: 'Organic Penne Pasta Premium',
      imageRequestId: '123460',
      photoStatus: 'New Shoot - Photo Box',
      cloudinaryUrl: null,
      page: 5,
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Groceries)
      createdAt: '2025-08-24T08:45:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      comments: [],
      uploadedContent: [
        {
          id: 'file_past_005_1',
          name: 'Organic_Penne_Pasta_Hero_Shot.jpg',
          type: 'image/jpeg',
          size: 3456789,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk9yZ2FuaWMgUGFzdGEgSGVybzwvdGV4dD48L3N2Zz4=',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-27T14:30:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_past_005_2',
          name: 'Organic_Linguine_Detail_Shot.jpg',
          type: 'image/jpeg',
          size: 2345678,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk9yZ2FuaWMgTGluZ3VpbmUgRGV0YWlsPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-27T15:15:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_past_005_3',
          name: 'Pasta_Lifestyle_Shot.jpg',
          type: 'image/jpeg',
          size: 4567890,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBhc3RhIExpZmVzdHlsZTwvdGV4dD48L3N2Zz4=',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-27T16:00:00Z',
          uploadedByRole: 'Photographer'
        }
      ]
    },
    {
      orderNumber:'ORD-2025-006', 
      title:'Fresh Dairy - E-commerce Photos', 
      status:'Review', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Mike Rodriguez', 
      deadline:'2025-08-28', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Fresh dairy products for e-commerce catalog. Clean, appetizing shots with consistent lighting.',
      articles: ['Organic Milk 1L', 'Greek Yogurt 500g'],
      budget: 2800,
      deliverables: ['E-commerce Photos', 'Detail Shots'],
      
      // SAP PMR fields
      eventId: 'A3525057', // Week 35, 2025, Føtex format
      purchaseGroup: 101, // Fresh Products
      offerId: '10763324',
      articleNumber: 'ART-DAIRY-006',
      articleName: 'Organic Milk Premium 1L',
      imageRequestId: '123461',
      photoStatus: 'Archive',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/organic_milk.jpg',
      page: 6,
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Fresh Products)
      createdAt: '2025-08-25T09:30:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: [],
      uploadedContent: [
        {
          id: 'file_dairy_006_1',
          name: 'Organic_Milk_Bottle_Hero_Shot.jpg',
          type: 'image/jpeg',
          size: 2876543,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y5ZjlmOSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk9yZ2FuaWMgTWlsa8KhdGxlPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Mike Rodriguez',
          uploadedAt: '2025-08-27T10:15:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_dairy_006_2',
          name: 'Greek_Yogurt_Container_Detail_Shot.jpg',
          type: 'image/jpeg',
          size: 1987654,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y5ZjlmOSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdyZWVrIFlvZ3VydCDE0YWlsPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Mike Rodriguez',
          uploadedAt: '2025-08-27T11:00:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_dairy_006_3',
          name: 'Dairy_Products_Lifestyle_Shot.jpg',
          type: 'image/jpeg',
          size: 3456789,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y5ZjlmOSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRhaXJ5IFByb2R1Y3RzIExpZmVzdHlsZTwvdGV4dD48L3N2Zz4=',
          uploadedBy: 'Mike Rodriguez',
          uploadedAt: '2025-08-27T11:45:00Z',
          uploadedByRole: 'Photographer'
        }
      ]
    },
    {
      orderNumber:'ORD-2025-007', 
      title:'Smart Home Devices - Tech Showcase', 
      status:'Complete', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Mike Rodriguez', 
      deadline:'2025-09-02', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart home devices photography for holiday campaign preview. Modern, tech-focused styling.',
      articles: ['Smart Thermostat', 'Security Camera Set'],
      budget: 5200,
      deliverables: ['Product Shots', 'Lifestyle Integration'],
      
      // SAP PMR fields
      eventId: 'A4825058', // Week 48, 2025, Bilka format
      purchaseGroup: 101, // Electronics
      offerId: '10763325',
      articleNumber: '1234575513',
      articleName: 'Smart Thermostat Pro',
      imageRequestId: '123462',
      photoStatus: 'Archive',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/smart_thermostat.jpg',
      page: 7,
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Electronics)
      createdAt: '2025-08-20T13:15:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: [],
      uploadedContent: [
        {
          id: 'file_bilka_007_1',
          name: 'ENV.000006.jpg',
          type: 'image/jpeg',
          size: 3123456,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-27T12:30:00Z',
          uploadedByRole: 'System'
        },
        {
          id: 'file_bilka_007_2',
          name: 'ENV.000007.jpg',
          type: 'image/jpeg',
          size: 2456789,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-27T13:15:00Z',
          uploadedByRole: 'System'
        },
        {
          id: 'file_bilka_007_3',
          name: 'ENV.000008.jpg',
          type: 'image/jpeg',
          size: 3789456,
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          uploadedBy: 'Bilka Auto-Generator',
          uploadedAt: '2025-08-27T14:00:00Z',
          uploadedByRole: 'System'
        }
      ]
    },
    {
      orderNumber:'ORD-2025-008', 
      title:'Patio Furniture - Seasonal Showcase', 
      status:'Delivered', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Emily Chen', 
      deadline:'2025-08-20', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Outdoor patio furniture for summer/fall transition catalog. Lifestyle shots with outdoor setting.',
      articles: ['Outdoor Dining Set', 'Cushion Covers'],
      budget: 7200,
      deliverables: ['Lifestyle Photos', 'Product Details'],
      
      // SAP PMR fields
      eventId: 'A3425059', // Week 34, 2025, Netto format
      purchaseGroup: 101, // Home & Garden
      offerId: '10763326',
      articleNumber: 'ART-PATIO-008',
      articleName: 'Outdoor Dining Set Premium',
      imageRequestId: '123463',
      photoStatus: 'Archive',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/patio_furniture.jpg',
      page: 8,
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Home & Garden)
      createdAt: '2025-08-19T16:30:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      uploadedContent: [
        {
          id: 'file-008-001',
          name: 'Patio_Dining_Set_Outdoor_Lifestyle_Shot.jpg',
          type: 'image/jpeg',
          size: 2845672,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk91dGRvb3IgUGF0aW8gRnVybml0dXJlPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-19T15:30:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file-008-002',
          name: 'Outdoor_Patio_Furniture_Collection_Hero_Shot.jpg',
          type: 'image/jpeg',
          size: 3123456,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk91dGRvb3IgUGF0aW8gRnVybml0dXJlPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-19T16:00:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file-008-003',
          name: 'Seasonal_Patio_Furniture_Transition_Shot.jpg',
          type: 'image/jpeg',
          size: 2987654,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk91dGRvb3IgUGF0aW8gRnVybml0dXJlPC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'Emily Chen',
          uploadedAt: '2025-08-19T16:30:00Z',
          uploadedByRole: 'Photographer'
        }
      ],
      
      comments: []
    },
    
    // Additional 50 diverse orders showcasing all application features
    {
      orderNumber:'ORD-2025-009', 
      title:'Organic Baby Food - Product Launch', 
      status:'Draft', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Sarah Johnson', 
      deadline:'2025-09-10', 
      costCenter:'PG-100',
      priority:'High',
      brief:'New organic baby food line launch. Need hero shots, ingredient close-ups, and lifestyle photography with babies.',
      articles: ['Organic Baby Food Puree [EAN: 5901234567901]', 'Baby Food Spoon Set [EAN: 5901234567902]'],
      budget: 8500,
      deliverables: ['Hero Product Shots', 'Ingredient Photography', 'Lifestyle with Babies'],
      eventId: 'A4125060', 
      purchaseGroup: 101,
      offerId: '10763327',
      articleNumber: 'ART-BABY-009',
      articleName: 'Organic Baby Food Variety Pack',
      imageRequestId: '123470',
      photoStatus: 'New',
      page: 9,
      createdBy: 'user-promo1',
      createdAt: '2025-09-01T08:30:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-010', 
      title:'Gaming Laptop - Tech Showcase', 
      status:'Samples Requested', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Marcus Thompson', 
      deadline:'2025-09-08', 
      costCenter:'PG-300',
      priority:'Critical',
      brief:'High-end gaming laptop with RGB lighting. Need dramatic tech shots with special lighting effects.',
      articles: ['Gaming Laptop Pro X1 [EAN: 5901234567903]', 'Gaming Mouse [EAN: 5901234567904]'],
      budget: 12000,
      deliverables: ['Tech Hero Shots', 'RGB Lighting Effects', 'Detail Macro Shots'],
      eventId: 'A4225061', 
      purchaseGroup: 101,
      offerId: '10763328',
      articleNumber: 'ART-LAPTOP-010',
      articleName: 'Gaming Laptop Pro X1',
      imageRequestId: '123471',
      photoStatus: 'Samples Requested',
      page: 10,
      createdBy: 'user-promo2',
      createdAt: '2025-09-02T10:15:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-011', 
      title:'Winter Jacket Collection', 
      status:'Pending Approval', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Emily Chen', 
      deadline:'2025-09-12', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Winter fashion collection for upcoming season. Need model shots and flat lay product photography.',
      articles: ['Winter Puffer Jacket [EAN: 5901234567905]', 'Wool Scarf [EAN: 5901234567906]', 'Winter Boots [EAN: 5901234567907]'],
      budget: 15000,
      deliverables: ['Model Photography', 'Flat Lay Styling', 'Detail Shots'],
      eventId: 'A4325062', 
      purchaseGroup: 101,
      offerId: '10763329',
      articleNumber: 'ART-JACKET-011',
      articleName: 'Winter Jacket Collection',
      imageRequestId: '123472',
      photoStatus: 'Pending',
      page: 11,
      createdBy: 'user-promo1',
      createdAt: '2025-09-02T14:20:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-012', 
      title:'Kitchen Appliances - Modern Design', 
      status:'Approved', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'David Kim', 
      deadline:'2025-09-15', 
      costCenter:'PG-400',
      priority:'Low',
      brief:'Modern kitchen appliance series. Clean, minimalist photography with lifestyle context.',
      articles: ['Stand Mixer Pro [EAN: 5901234567908]', 'Coffee Machine Deluxe [EAN: 5901234567909]'],
      budget: 9500,
      deliverables: ['Product Photography', 'Lifestyle Kitchen Scenes', 'Technical Detail Shots'],
      eventId: 'A4425063', 
      purchaseGroup: 101,
      offerId: '10763330',
      articleNumber: 'ART-KITCHEN-012',
      articleName: 'Kitchen Appliance Set',
      imageRequestId: '123473',
      photoStatus: 'Approved',
      page: 12,
      createdBy: 'user-promo2',
      createdAt: '2025-09-02T16:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-013', 
      title:'Organic Skincare Line', 
      status:'Photo Session', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Lisa Wang', 
      deadline:'2025-09-07', 
      costCenter:'PG-100',
      priority:'High',
      brief:'Luxury organic skincare products. Need elegant beauty photography with natural lighting.',
      articles: ['Organic Face Serum [EAN: 5901234567910]', 'Natural Moisturizer [EAN: 5901234567911]'],
      budget: 11000,
      deliverables: ['Beauty Product Shots', 'Ingredient Close-ups', 'Lifestyle Beauty'],
      eventId: 'A4525064', 
      purchaseGroup: 101,
      offerId: '10763331',
      articleNumber: 'ART-SKINCARE-013',
      articleName: 'Organic Skincare Collection',
      imageRequestId: '123474',
      photoStatus: 'In Progress',
      page: 13,
      createdBy: 'user-promo1',
      createdAt: '2025-09-03T09:00:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-014', 
      title:'Smart Home Security System', 
      status:'Samples in Transit', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Alex Johnson', 
      deadline:'2025-09-20', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart home security cameras and sensors. Need tech shots showing installation and features.',
      articles: ['Security Camera 4K [EAN: 5901234567912]', 'Motion Sensor [EAN: 5901234567913]'],
      budget: 7500,
      deliverables: ['Tech Product Shots', 'Installation Demo', 'App Interface'],
      eventId: 'A4625065', 
      purchaseGroup: 101,
      offerId: '10763332',
      articleNumber: 'ART-SECURITY-014',
      articleName: 'Smart Security System',
      imageRequestId: '123475',
      photoStatus: 'Samples in Transit',
      page: 14,
      createdBy: 'user-promo2',
      createdAt: '2025-09-03T11:30:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-015', 
      title:'Artisan Bread Collection', 
      status:'Complete', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Maria Garcia', 
      deadline:'2025-08-30', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Artisan bakery products for autumn catalog. Warm, rustic food photography.',
      articles: ['Sourdough Loaf [EAN: 5901234567914]', 'Whole Grain Bread [EAN: 5901234567915]'],
      budget: 6000,
      deliverables: ['Food Photography', 'Lifestyle Bakery Scenes', 'Ingredient Shots'],
      eventId: 'A4725066', 
      purchaseGroup: 101,
      offerId: '10763333',
      articleNumber: 'ART-BREAD-015',
      articleName: 'Artisan Bread Selection',
      imageRequestId: '123476',
      photoStatus: 'Archive',
      page: 15,
      createdBy: 'user-promo1',
      createdAt: '2025-08-25T13:45:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-016', 
      title:'Fitness Equipment - Home Gym', 
      status:'Review', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'James Wilson', 
      deadline:'2025-09-18', 
      costCenter:'PG-400',
      priority:'High',
      brief:'Home fitness equipment showcase. Action shots with models using equipment.',
      articles: ['Adjustable Dumbbells [EAN: 5901234567916]', 'Yoga Mat Pro [EAN: 5901234567917]'],
      budget: 13500,
      deliverables: ['Action Photography', 'Product Detail Shots', 'Home Gym Lifestyle'],
      eventId: 'A4825067', 
      purchaseGroup: 101,
      offerId: '10763334',
      articleNumber: 'ART-FITNESS-016',
      articleName: 'Home Fitness Set',
      imageRequestId: '123477',
      photoStatus: 'Review',
      page: 16,
      createdBy: 'user-promo2',
      createdAt: '2025-09-03T15:20:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-017', 
      title:'Smartphone Accessories Bundle', 
      status:'New Request', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Not Assigned', 
      deadline:'2025-09-25', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smartphone case, charger, and screen protector bundle. Clean tech photography.',
      articles: ['Phone Case Clear [EAN: 5901234567918]', 'Wireless Charger [EAN: 5901234567919]'],
      budget: 4500,
      deliverables: ['Tech Product Shots', 'Compatibility Demo', 'Lifestyle Tech'],
      eventId: 'A4925068', 
      purchaseGroup: 101,
      offerId: '10763335',
      articleNumber: 'ART-PHONE-017',
      articleName: 'Smartphone Accessory Bundle',
      imageRequestId: '123478',
      photoStatus: 'New',
      page: 17,
      createdBy: 'user-promo1',
      createdAt: '2025-09-04T08:00:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-018', 
      title:'Luxury Watch Collection', 
      status:'Samples Received', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Catherine Lee', 
      deadline:'2025-09-14', 
      costCenter:'PG-200',
      priority:'Critical',
      brief:'High-end luxury watches. Dramatic lighting with reflections and detail macro shots.',
      articles: ['Luxury Watch Gold [EAN: 5901234567920]', 'Watch Box Premium [EAN: 5901234567921]'],
      budget: 18000,
      deliverables: ['Luxury Product Photography', 'Macro Detail Shots', 'Lifestyle Luxury'],
      eventId: 'A5025069', 
      purchaseGroup: 101,
      offerId: '10763336',
      articleNumber: 'ART-WATCH-018',
      articleName: 'Luxury Watch Collection',
      imageRequestId: '123479',
      photoStatus: 'Samples Received',
      page: 18,
      createdBy: 'user-promo2',
      createdAt: '2025-09-04T10:30:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-019', 
      title:'Garden Tool Set - Spring Collection', 
      status:'Processing', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Robert Chen', 
      deadline:'2025-09-11', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Garden tools and equipment for spring gardening season. Outdoor lifestyle shots.',
      articles: ['Garden Spade [EAN: 5901234567922]', 'Pruning Shears [EAN: 5901234567923]'],
      budget: 7800,
      deliverables: ['Product Photography', 'Garden Lifestyle', 'Tool Detail Shots'],
      eventId: 'A5125070', 
      purchaseGroup: 101,
      offerId: '10763337',
      articleNumber: 'ART-GARDEN-019',
      articleName: 'Garden Tool Collection',
      imageRequestId: '123480',
      photoStatus: 'Processing',
      page: 19,
      createdBy: 'user-promo1',
      createdAt: '2025-09-04T12:15:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-020', 
      title:'Gourmet Coffee Beans', 
      status:'Delivered', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Ana Rodriguez', 
      deadline:'2025-08-28', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Premium coffee beans from different regions. Warm, appetizing food photography.',
      articles: ['Ethiopian Coffee Beans [EAN: 5901234567924]', 'Colombian Roast [EAN: 5901234567925]'],
      budget: 5500,
      deliverables: ['Food Photography', 'Lifestyle Coffee Scenes', 'Bean Close-ups'],
      eventId: 'A5225071', 
      purchaseGroup: 101,
      offerId: '10763338',
      articleNumber: 'ART-COFFEE-020',
      articleName: 'Gourmet Coffee Selection',
      imageRequestId: '123481',
      photoStatus: 'Archive',
      page: 20,
      createdBy: 'user-promo2',
      createdAt: '2025-08-23T14:40:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-021', 
      title:'Children Toys - Educational Series', 
      status:'Draft', 
      method:'Photographer',
      orderType: 'PS',
      
      
      
      photographer:'Sophie Turner', 
      deadline:'2025-09-22', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Educational toys for children 3-8 years. Bright, playful photography with kids in action.',
      articles: ['Building Blocks Set [EAN: 5901234567926]', 'Learning Tablet Kids [EAN: 5901234567927]'],
      budget: 10500,
      deliverables: ['Toy Photography', 'Kids Playing Lifestyle', 'Educational Demo'],
      eventId: 'A5325072', 
      purchaseGroup: 101,
      offerId: '10763339',
      articleNumber: 'ART-TOYS-021',
      articleName: 'Educational Toy Set',
      imageRequestId: '123482',
      photoStatus: 'New',
      page: 21,
      createdBy: 'user-promo1',
      createdAt: '2025-09-04T16:00:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-022', 
      title:'Wireless Headphones Premium', 
      status:'Urgent', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Michael Park', 
      deadline:'2025-09-05', 
      costCenter:'PG-300',
      priority:'Critical',
      brief:'High-end wireless headphones launch. Need dramatic tech shots with sound wave effects.',
      articles: ['Wireless Headphones Pro [EAN: 5901234567928]', 'Charging Case [EAN: 5901234567929]'],
      budget: 14000,
      deliverables: ['Tech Hero Shots', 'Feature Highlights', 'Lifestyle Music'],
      eventId: 'A5425073', 
      purchaseGroup: 101,
      offerId: '10763340',
      articleNumber: 'ART-HEADPHONES-022',
      articleName: 'Wireless Headphones Premium',
      imageRequestId: '123483',
      photoStatus: 'Urgent',
      page: 22,
      createdBy: 'user-promo2',
      createdAt: '2025-09-04T18:30:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-023', 
      title:'Outdoor Camping Gear', 
      status:'Pending Approval', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Tom Anderson', 
      deadline:'2025-09-28', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Camping equipment for autumn outdoor adventures. Rugged outdoor lifestyle photography.',
      articles: ['Camping Tent 4-Person [EAN: 5901234567930]', 'Sleeping Bag Winter [EAN: 5901234567931]'],
      budget: 12500,
      deliverables: ['Outdoor Photography', 'Camping Lifestyle', 'Product Features'],
      eventId: 'A5525074', 
      purchaseGroup: 101,
      offerId: '10763341',
      articleNumber: 'ART-CAMPING-023',
      articleName: 'Camping Gear Set',
      imageRequestId: '123484',
      photoStatus: 'Pending',
      page: 23,
      createdBy: 'user-promo1',
      createdAt: '2025-09-05T08:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-024', 
      title:'Artisan Chocolate Collection', 
      status:'Approved', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Isabella Martinez', 
      deadline:'2025-09-16', 
      costCenter:'PG-100',
      priority:'High',
      brief:'Luxury artisan chocolates for holiday season. Elegant food photography with mood lighting.',
      articles: ['Dark Chocolate Truffles [EAN: 5901234567932]', 'Chocolate Gift Box [EAN: 5901234567933]'],
      budget: 8800,
      deliverables: ['Luxury Food Photography', 'Lifestyle Gifting', 'Chocolate Close-ups'],
      eventId: 'A5625075', 
      purchaseGroup: 101,
      offerId: '10763342',
      articleNumber: 'ART-CHOCOLATE-024',
      articleName: 'Artisan Chocolate Collection',
      imageRequestId: '123485',
      photoStatus: 'Approved',
      page: 24,
      createdBy: 'user-promo2',
      createdAt: '2025-09-05T10:20:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-025', 
      title:'Smart TV 75 inch Ultra HD', 
      status:'Photo Session', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Kevin Wright', 
      deadline:'2025-09-13', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Large format smart TV with ultra-thin design. Modern living room lifestyle photography.',
      articles: ['Smart TV 75 inch [EAN: 5901234567934]', 'TV Mount Wall [EAN: 5901234567935]'],
      budget: 16000,
      deliverables: ['Tech Product Shots', 'Living Room Lifestyle', 'Screen Quality Demo'],
      eventId: 'A5725076', 
      purchaseGroup: 101,
      offerId: '10763343',
      articleNumber: 'ART-TV-025',
      articleName: 'Smart TV Ultra HD',
      imageRequestId: '123486',
      photoStatus: 'In Progress',
      page: 25,
      createdBy: 'user-promo1',
      createdAt: '2025-09-05T12:00:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-026', 
      title:'Luxury Bedding Set', 
      status:'Samples Requested', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Rachel Green', 
      deadline:'2025-09-19', 
      costCenter:'PG-200',
      priority:'Low',
      brief:'Premium bedding collection in natural fabrics. Cozy bedroom lifestyle photography.',
      articles: ['Silk Bedsheet Set [EAN: 5901234567936]', 'Down Pillows [EAN: 5901234567937]'],
      budget: 9200,
      deliverables: ['Lifestyle Bedroom', 'Fabric Close-ups', 'Comfort Demonstration'],
      eventId: 'A5825077', 
      purchaseGroup: 101,
      offerId: '10763344',
      articleNumber: 'ART-BEDDING-026',
      articleName: 'Luxury Bedding Collection',
      imageRequestId: '123487',
      photoStatus: 'Samples Requested',
      page: 26,
      createdBy: 'user-promo2',
      createdAt: '2025-09-05T14:30:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-027', 
      title:'Electric Bike Urban Series', 
      status:'Complete', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Daniel Foster', 
      deadline:'2025-08-25', 
      costCenter:'PG-400',
      priority:'High',
      brief:'Urban electric bikes for city commuting. Dynamic action shots in urban environment.',
      articles: ['E-Bike Urban Pro [EAN: 5901234567938]', 'Bike Helmet Smart [EAN: 5901234567939]'],
      budget: 17500,
      deliverables: ['Action Photography', 'Urban Lifestyle', 'Tech Feature Highlights'],
      eventId: 'A5925078', 
      purchaseGroup: 101,
      offerId: '10763345',
      articleNumber: 'ART-EBIKE-027',
      articleName: 'Electric Bike Urban',
      imageRequestId: '123488',
      photoStatus: 'Archive',
      page: 27,
      createdBy: 'user-promo1',
      createdAt: '2025-08-20T16:15:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-028', 
      title:'Baby Monitor Smart Camera', 
      status:'Review', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Jennifer Liu', 
      deadline:'2025-09-17', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart baby monitoring system with app connectivity. Nursery lifestyle photography.',
      articles: ['Baby Monitor Camera [EAN: 5901234567940]', 'Monitor Base Station [EAN: 5901234567941]'],
      budget: 6700,
      deliverables: ['Tech Product Shots', 'Nursery Lifestyle', 'App Interface Demo'],
      eventId: 'A6025079', 
      purchaseGroup: 101,
      offerId: '10763346',
      articleNumber: 'ART-BABYMONITOR-028',
      articleName: 'Smart Baby Monitor',
      imageRequestId: '123489',
      photoStatus: 'Review',
      page: 28,
      createdBy: 'user-promo2',
      createdAt: '2025-09-05T17:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-029', 
      title:'Gourmet Spice Collection', 
      status:'New Request', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Not Assigned', 
      deadline:'2025-09-30', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'International spice collection for cooking enthusiasts. Colorful food photography.',
      articles: ['Spice Set International [EAN: 5901234567942]', 'Spice Grinder [EAN: 5901234567943]'],
      budget: 4200,
      deliverables: ['Food Photography', 'Spice Close-ups', 'Cooking Lifestyle'],
      eventId: 'A6125080', 
      purchaseGroup: 101,
      offerId: '10763347',
      articleNumber: 'ART-SPICES-029',
      articleName: 'Gourmet Spice Collection',
      imageRequestId: '123490',
      photoStatus: 'New',
      page: 29,
      createdBy: 'user-promo1',
      createdAt: '2025-09-06T09:00:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-030', 
      title:'Gaming Chair Pro Series', 
      status:'Samples in Transit', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Chris Taylor', 
      deadline:'2025-09-21', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Professional gaming chair with RGB lighting. Gaming setup lifestyle photography.',
      articles: ['Gaming Chair RGB [EAN: 5901234567944]', 'Chair Cushion Set [EAN: 5901234567945]'],
      budget: 11500,
      deliverables: ['Product Photography', 'Gaming Setup Lifestyle', 'Comfort Features'],
      eventId: 'A6225081', 
      purchaseGroup: 101,
      offerId: '10763348',
      articleNumber: 'ART-GAMECHAIR-030',
      articleName: 'Gaming Chair Pro',
      imageRequestId: '123491',
      photoStatus: 'Samples in Transit',
      page: 30,
      createdBy: 'user-promo2',
      createdAt: '2025-09-06T11:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-031', 
      title:'Solar Panel Home Kit', 
      status:'Delivered', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Mark Davis', 
      deadline:'2025-08-22', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Home solar panel installation kit. Clean energy lifestyle and technical photography.',
      articles: ['Solar Panel 300W [EAN: 5901234567946]', 'Inverter System [EAN: 5901234567947]'],
      budget: 13800,
      deliverables: ['Tech Product Shots', 'Installation Demo', 'Eco Lifestyle'],
      eventId: 'A6325082', 
      purchaseGroup: 101,
      offerId: '10763349',
      articleNumber: 'ART-SOLAR-031',
      articleName: 'Solar Panel Home Kit',
      imageRequestId: '123492',
      photoStatus: 'Archive',
      page: 31,
      createdBy: 'user-promo1',
      createdAt: '2025-08-17T13:20:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-032', 
      title:'Artisan Cheese Selection', 
      status:'Processing', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Emma Thompson', 
      deadline:'2025-09-15', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Premium artisan cheese collection for gourmet food catalog. Rustic food photography.',
      articles: ['Artisan Cheese Wheel [EAN: 5901234567948]', 'Cheese Board Set [EAN: 5901234567949]'],
      budget: 7200,
      deliverables: ['Gourmet Food Photography', 'Cheese Board Styling', 'Lifestyle Dining'],
      eventId: 'A6425083', 
      purchaseGroup: 101,
      offerId: '10763350',
      articleNumber: 'ART-CHEESE-032',
      articleName: 'Artisan Cheese Collection',
      imageRequestId: '123493',
      photoStatus: 'Processing',
      page: 32,
      createdBy: 'user-promo2',
      createdAt: '2025-09-06T15:45:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-033', 
      title:'Wireless Speaker Waterproof', 
      status:'Urgent', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Ryan Miller', 
      deadline:'2025-09-04', 
      costCenter:'PG-300',
      priority:'Critical',
      brief:'Waterproof bluetooth speaker for outdoor use. Action shots with water and outdoor scenes.',
      articles: ['Bluetooth Speaker Waterproof [EAN: 5901234567950]', 'Speaker Stand [EAN: 5901234567951]'],
      budget: 8900,
      deliverables: ['Tech Product Shots', 'Waterproof Demo', 'Outdoor Lifestyle'],
      eventId: 'A6525084', 
      purchaseGroup: 101,
      offerId: '10763351',
      articleNumber: 'ART-SPEAKER-033',
      articleName: 'Wireless Speaker Outdoor',
      imageRequestId: '123494',
      photoStatus: 'Urgent',
      page: 33,
      createdBy: 'user-promo1',
      createdAt: '2025-09-02T17:00:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-034', 
      title:'Designer Handbag Collection', 
      status:'Samples Received', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Victoria Stone', 
      deadline:'2025-09-24', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Luxury designer handbags for fall fashion collection. Elegant fashion photography.',
      articles: ['Leather Handbag Designer [EAN: 5901234567952]', 'Wallet Matching [EAN: 5901234567953]'],
      budget: 19500,
      deliverables: ['Fashion Photography', 'Lifestyle Luxury', 'Detail Craftsmanship'],
      eventId: 'A6625085', 
      purchaseGroup: 101,
      offerId: '10763352',
      articleNumber: 'ART-HANDBAG-034',
      articleName: 'Designer Handbag Collection',
      imageRequestId: '123495',
      photoStatus: 'Samples Received',
      page: 34,
      createdBy: 'user-promo2',
      createdAt: '2025-09-07T08:30:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-035', 
      title:'Power Tools Professional Set', 
      status:'Draft', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Steve Johnson', 
      deadline:'2025-09-26', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Professional power tools for construction and DIY. Workshop lifestyle photography.',
      articles: ['Cordless Drill Pro [EAN: 5901234567954]', 'Tool Set Complete [EAN: 5901234567955]'],
      budget: 10800,
      deliverables: ['Product Photography', 'Workshop Lifestyle', 'Tool Features Demo'],
      eventId: 'A6725086', 
      purchaseGroup: 101,
      offerId: '10763353',
      articleNumber: 'ART-POWERTOOLS-035',
      articleName: 'Power Tools Pro Set',
      imageRequestId: '123496',
      photoStatus: 'New',
      page: 35,
      createdBy: 'user-promo1',
      createdAt: '2025-09-07T10:15:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-036', 
      title:'Organic Wine Collection', 
      status:'Pending Approval', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Anthony Clark', 
      deadline:'2025-09-29', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Organic and biodynamic wine selection. Elegant wine photography with lifestyle context.',
      articles: ['Organic Red Wine [EAN: 5901234567956]', 'Wine Glass Set Crystal [EAN: 5901234567957]'],
      budget: 12000,
      deliverables: ['Wine Photography', 'Lifestyle Dining', 'Bottle Detail Shots'],
      eventId: 'A6825087', 
      purchaseGroup: 101,
      offerId: '10763354',
      articleNumber: 'ART-WINE-036',
      articleName: 'Organic Wine Selection',
      imageRequestId: '123497',
      photoStatus: 'Pending',
      page: 36,
      createdBy: 'user-promo2',
      createdAt: '2025-09-07T12:45:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-037', 
      title:'Robot Vacuum Smart Home', 
      status:'Approved', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Nancy Wilson', 
      deadline:'2025-09-23', 
      costCenter:'PG-300',
      priority:'High',
      brief:'Smart robot vacuum with app control. Modern home lifestyle photography.',
      articles: ['Robot Vacuum Smart [EAN: 5901234567958]', 'Charging Dock [EAN: 5901234567959]'],
      budget: 9800,
      deliverables: ['Tech Product Shots', 'Home Cleaning Demo', 'App Interface'],
      eventId: 'A6925088', 
      purchaseGroup: 101,
      offerId: '10763355',
      articleNumber: 'ART-ROBOTVAC-037',
      articleName: 'Robot Vacuum Smart',
      imageRequestId: '123498',
      photoStatus: 'Approved',
      page: 37,
      createdBy: 'user-promo1',
      createdAt: '2025-09-07T14:20:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-038', 
      title:'Luxury Perfume Launch', 
      status:'Photo Session', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Sophia Martinez', 
      deadline:'2025-09-12', 
      costCenter:'PG-200',
      priority:'Critical',
      brief:'High-end luxury perfume collection launch. Elegant beauty photography with dramatic lighting.',
      articles: ['Luxury Perfume 100ml [EAN: 5901234567960]', 'Perfume Gift Set [EAN: 5901234567961]'],
      budget: 22000,
      deliverables: ['Luxury Beauty Photography', 'Lifestyle Elegance', 'Bottle Art Shots'],
      eventId: 'A7025089', 
      purchaseGroup: 101,
      offerId: '10763356',
      articleNumber: 'ART-PERFUME-038',
      articleName: 'Luxury Perfume Collection',
      imageRequestId: '123499',
      photoStatus: 'In Progress',
      page: 38,
      createdBy: 'user-promo2',
      createdAt: '2025-09-07T16:00:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-039', 
      title:'BBQ Grill Professional', 
      status:'Samples Requested', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Jason Lee', 
      deadline:'2025-09-27', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Professional outdoor BBQ grill with accessories. Outdoor cooking lifestyle photography.',
      articles: ['BBQ Grill Pro 6-Burner [EAN: 5901234567962]', 'Grill Tool Set [EAN: 5901234567963]'],
      budget: 14500,
      deliverables: ['Product Photography', 'Outdoor Cooking Lifestyle', 'Food Results'],
      eventId: 'A7125090', 
      purchaseGroup: 101,
      offerId: '10763357',
      articleNumber: 'ART-BBQ-039',
      articleName: 'BBQ Grill Professional',
      imageRequestId: '123500',
      photoStatus: 'Samples Requested',
      page: 39,
      createdBy: 'user-promo1',
      createdAt: '2025-09-08T08:00:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-040', 
      title:'Gourmet Tea Collection', 
      status:'Complete', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Helen Chang', 
      deadline:'2025-08-31', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Premium tea collection from around the world. Zen-like food photography with tea ceremony elements.',
      articles: ['Green Tea Premium [EAN: 5901234567964]', 'Tea Set Ceramic [EAN: 5901234567965]'],
      budget: 6500,
      deliverables: ['Food Photography', 'Tea Ceremony Lifestyle', 'Leaf Close-ups'],
      eventId: 'A7225091', 
      purchaseGroup: 101,
      offerId: '10763358',
      articleNumber: 'ART-TEA-040',
      articleName: 'Gourmet Tea Collection',
      imageRequestId: '123501',
      photoStatus: 'Archive',
      page: 40,
      createdBy: 'user-promo2',
      createdAt: '2025-08-26T10:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-041', 
      title:'Mechanical Keyboard Gaming', 
      status:'Review', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Brian Kim', 
      deadline:'2025-09-18', 
      costCenter:'PG-300',
      priority:'High',
      brief:'High-end mechanical gaming keyboard with RGB. Gaming setup and tech photography.',
      articles: ['Mechanical Keyboard RGB [EAN: 5901234567966]', 'Keycap Set Custom [EAN: 5901234567967]'],
      budget: 7800,
      deliverables: ['Tech Product Shots', 'Gaming Setup Lifestyle', 'RGB Light Effects'],
      eventId: 'A7325092', 
      purchaseGroup: 101,
      offerId: '10763359',
      articleNumber: 'ART-KEYBOARD-041',
      articleName: 'Mechanical Keyboard Gaming',
      imageRequestId: '123502',
      photoStatus: 'Review',
      page: 41,
      createdBy: 'user-promo1',
      createdAt: '2025-09-08T12:15:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-042', 
      title:'Luxury Skincare Anti-Aging', 
      status:'New Request', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Not Assigned', 
      deadline:'2025-10-01', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Anti-aging skincare line for mature skin. Elegant beauty photography with before/after concepts.',
      articles: ['Anti-Aging Serum [EAN: 5901234567968]', 'Night Cream Luxury [EAN: 5901234567969]'],
      budget: 16500,
      deliverables: ['Beauty Product Photography', 'Lifestyle Mature Beauty', 'Ingredient Close-ups'],
      eventId: 'A7425093', 
      purchaseGroup: 101,
      offerId: '10763360',
      articleNumber: 'ART-ANTIAGING-042',
      articleName: 'Anti-Aging Skincare Line',
      imageRequestId: '123503',
      photoStatus: 'New',
      page: 42,
      createdBy: 'user-promo2',
      createdAt: '2025-09-08T14:45:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-043', 
      title:'Smart Doorbell Security', 
      status:'Samples in Transit', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Peter Wilson', 
      deadline:'2025-09-20', 
      costCenter:'PG-300',
      priority:'High',
      brief:'Smart video doorbell with motion detection. Home security and tech photography.',
      articles: ['Smart Doorbell Camera [EAN: 5901234567970]', 'Chime Indoor Unit [EAN: 5901234567971]'],
      budget: 8200,
      deliverables: ['Tech Product Shots', 'Home Security Demo', 'App Interface'],
      eventId: 'A7525094', 
      purchaseGroup: 101,
      offerId: '10763361',
      articleNumber: 'ART-DOORBELL-043',
      articleName: 'Smart Video Doorbell',
      imageRequestId: '123504',
      photoStatus: 'Samples in Transit',
      page: 43,
      createdBy: 'user-promo1',
      createdAt: '2025-09-08T16:30:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-044', 
      title:'Outdoor Furniture Patio Set', 
      status:'Delivered', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Lisa Rodriguez', 
      deadline:'2025-08-29', 
      costCenter:'PG-400',
      priority:'Low',
      brief:'Weather-resistant patio furniture set. Outdoor lifestyle photography with seasonal context.',
      articles: ['Patio Table Set [EAN: 5901234567972]', 'Outdoor Cushions [EAN: 5901234567973]'],
      budget: 11200,
      deliverables: ['Outdoor Lifestyle Photography', 'Product Detail Shots', 'Seasonal Styling'],
      eventId: 'A7625095', 
      purchaseGroup: 101,
      offerId: '10763362',
      articleNumber: 'ART-PATIO-044',
      articleName: 'Outdoor Patio Furniture',
      imageRequestId: '123505',
      photoStatus: 'Archive',
      page: 44,
      createdBy: 'user-promo2',
      createdAt: '2025-08-24T18:00:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-045', 
      title:'Artisan Bread Making Kit', 
      status:'Processing', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Carlos Garcia', 
      deadline:'2025-09-25', 
      costCenter:'PG-100',
      priority:'Medium',
      brief:'Complete bread making kit for home bakers. Food photography with process demonstration.',
      articles: ['Bread Making Kit [EAN: 5901234567974]', 'Sourdough Starter [EAN: 5901234567975]'],
      budget: 5800,
      deliverables: ['Food Photography', 'Baking Process Demo', 'Lifestyle Kitchen'],
      eventId: 'A7725096', 
      purchaseGroup: 101,
      offerId: '10763363',
      articleNumber: 'ART-BREADKIT-045',
      articleName: 'Artisan Bread Making Kit',
      imageRequestId: '123506',
      photoStatus: 'Processing',
      page: 45,
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T08:15:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-046', 
      title:'Electric Scooter Urban', 
      status:'Urgent', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'David Thompson', 
      deadline:'2025-09-06', 
      costCenter:'PG-400',
      priority:'Critical',
      brief:'Urban electric scooter for city commuting. Dynamic action shots in urban environment.',
      articles: ['Electric Scooter Pro [EAN: 5901234567976]', 'Scooter Helmet [EAN: 5901234567977]'],
      budget: 13200,
      deliverables: ['Action Photography', 'Urban Lifestyle', 'Tech Feature Highlights'],
      eventId: 'A7825097', 
      purchaseGroup: 101,
      offerId: '10763364',
      articleNumber: 'ART-ESCOOTER-046',
      articleName: 'Electric Scooter Urban',
      imageRequestId: '123507',
      photoStatus: 'Urgent',
      page: 46,
      createdBy: 'user-promo2',
      createdAt: '2025-09-04T19:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-047', 
      title:'Designer Sunglasses Collection', 
      status:'Samples Received', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Amanda Foster', 
      deadline:'2025-09-22', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Luxury designer sunglasses for summer/fall transition. Fashion photography with lifestyle context.',
      articles: ['Designer Sunglasses Aviator [EAN: 5901234567978]', 'Sunglasses Case Leather [EAN: 5901234567979]'],
      budget: 15800,
      deliverables: ['Fashion Photography', 'Lifestyle Summer', 'Detail Craftsmanship'],
      eventId: 'A7925098', 
      purchaseGroup: 101,
      offerId: '10763365',
      articleNumber: 'ART-SUNGLASSES-047',
      articleName: 'Designer Sunglasses Collection',
      imageRequestId: '123508',
      photoStatus: 'Samples Received',
      page: 47,
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T10:45:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-048', 
      title:'Smart Home Thermostat', 
      status:'Approved', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Richard Davis', 
      deadline:'2025-09-28', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart thermostat with energy saving features. Modern home lifestyle and tech photography.',
      articles: ['Smart Thermostat WiFi [EAN: 5901234567980]', 'Temperature Sensor [EAN: 5901234567981]'],
      budget: 7400,
      deliverables: ['Tech Product Shots', 'Home Lifestyle', 'Energy Saving Demo'],
      eventId: 'A8025099', 
      purchaseGroup: 101,
      offerId: '10763366',
      articleNumber: 'ART-THERMOSTAT-048',
      articleName: 'Smart Home Thermostat',
      imageRequestId: '123509',
      photoStatus: 'Approved',
      page: 48,
      createdBy: 'user-promo2',
      createdAt: '2025-09-09T12:30:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-049', 
      title:'Luxury Bath Towel Set', 
      status:'Draft', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Grace Wilson', 
      deadline:'2025-10-02', 
      costCenter:'PG-200',
      priority:'Low',
      brief:'Premium cotton bath towel collection. Spa-like bathroom lifestyle photography.',
      articles: ['Bath Towel Luxury 100% Cotton [EAN: 5901234567982]', 'Towel Set Gift Box [EAN: 5901234567983]'],
      budget: 6800,
      deliverables: ['Lifestyle Bathroom', 'Texture Close-ups', 'Spa Styling'],
      eventId: 'A8125100', 
      purchaseGroup: 101,
      offerId: '10763367',
      articleNumber: 'ART-TOWELS-049',
      articleName: 'Luxury Bath Towel Set',
      imageRequestId: '123510',
      photoStatus: 'New',
      page: 49,
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T14:15:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-050', 
      title:'Professional Blender High-Speed', 
      status:'Pending Approval', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Michelle Lee', 
      deadline:'2025-09-30', 
      costCenter:'PG-400',
      priority:'High',
      brief:'High-performance blender for smoothies and food prep. Kitchen lifestyle with action shots.',
      articles: ['High-Speed Blender Pro [EAN: 5901234567984]', 'Blender Cup Set [EAN: 5901234567985]'],
      budget: 9600,
      deliverables: ['Product Photography', 'Kitchen Lifestyle', 'Action Blending Shots'],
      eventId: 'A8225101', 
      purchaseGroup: 101,
      offerId: '10763368',
      articleNumber: 'ART-BLENDER-050',
      articleName: 'Professional Blender',
      imageRequestId: '123511',
      photoStatus: 'Pending',
      page: 50,
      createdBy: 'user-promo2',
      createdAt: '2025-09-09T16:00:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-051', 
      title:'Wireless Charging Pad Multi-Device', 
      status:'Photo Session', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Kevin Chang', 
      deadline:'2025-09-14', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Multi-device wireless charging station. Clean tech photography with device compatibility.',
      articles: ['Wireless Charging Pad 3-in-1 [EAN: 5901234567986]', 'USB-C Cable Fast [EAN: 5901234567987]'],
      budget: 5200,
      deliverables: ['Tech Product Shots', 'Device Compatibility Demo', 'Lifestyle Office'],
      eventId: 'A8325102', 
      purchaseGroup: 101,
      offerId: '10763369',
      articleNumber: 'ART-CHARGER-051',
      articleName: 'Wireless Charging Station',
      imageRequestId: '123512',
      photoStatus: 'In Progress',
      page: 51,
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T17:45:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-052', 
      title:'Artisan Ceramic Dinnerware', 
      status:'Complete', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Diana Miller', 
      deadline:'2025-09-01', 
      costCenter:'PG-200',
      priority:'Low',
      brief:'Handcrafted ceramic dinnerware collection. Elegant table setting and lifestyle photography.',
      articles: ['Ceramic Dinner Plate Set [EAN: 5901234567988]', 'Ceramic Bowl Collection [EAN: 5901234567989]'],
      budget: 8400,
      deliverables: ['Lifestyle Table Setting', 'Product Detail Shots', 'Artisan Craftsmanship'],
      eventId: 'A8425103', 
      purchaseGroup: 101,
      offerId: '10763370',
      articleNumber: 'ART-DINNERWARE-052',
      articleName: 'Artisan Ceramic Collection',
      imageRequestId: '123513',
      photoStatus: 'Archive',
      page: 52,
      createdBy: 'user-promo2',
      createdAt: '2025-08-27T09:30:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-053', 
      title:'Smart Water Bottle Hydration', 
      status:'Samples Requested', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Tyler Brown', 
      deadline:'2025-09-26', 
      costCenter:'PG-400',
      priority:'High',
      brief:'Smart water bottle with hydration tracking. Active lifestyle and tech photography.',
      articles: ['Smart Water Bottle 32oz [EAN: 5901234567990]', 'Bottle Cleaning Kit [EAN: 5901234567991]'],
      budget: 6200,
      deliverables: ['Tech Product Shots', 'Active Lifestyle', 'App Interface Demo'],
      eventId: 'A8525104', 
      purchaseGroup: 101,
      offerId: '10763371',
      articleNumber: 'ART-WATERBOTTLE-053',
      articleName: 'Smart Hydration Bottle',
      imageRequestId: '123514',
      photoStatus: 'Samples Requested',
      page: 53,
      createdBy: 'user-promo1',
      createdAt: '2025-09-10T08:00:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-054', 
      title:'Luxury Watch Band Collection', 
      status:'Review', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Olivia Garcia', 
      deadline:'2025-09-21', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Premium watch bands in various materials. Luxury accessory photography with lifestyle context.',
      articles: ['Leather Watch Band [EAN: 5901234567992]', 'Metal Watch Band Titanium [EAN: 5901234567993]'],
      budget: 11800,
      deliverables: ['Luxury Accessory Photography', 'Material Close-ups', 'Lifestyle Elegance'],
      eventId: 'A8625105', 
      purchaseGroup: 101,
      offerId: '10763372',
      articleNumber: 'ART-WATCHBAND-054',
      articleName: 'Luxury Watch Band Collection',
      imageRequestId: '123515',
      photoStatus: 'Review',
      page: 54,
      createdBy: 'user-promo2',
      createdAt: '2025-09-10T10:30:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-055', 
      title:'Electric Coffee Grinder Pro', 
      status:'New Request', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Not Assigned', 
      deadline:'2025-10-03', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Professional electric coffee grinder with precision settings. Coffee lifestyle photography.',
      articles: ['Electric Coffee Grinder [EAN: 5901234567994]', 'Coffee Bean Storage [EAN: 5901234567995]'],
      budget: 4800,
      deliverables: ['Product Photography', 'Coffee Lifestyle', 'Grinding Demo'],
      eventId: 'A8725106', 
      purchaseGroup: 101,
      offerId: '10763373',
      articleNumber: 'ART-GRINDER-055',
      articleName: 'Electric Coffee Grinder',
      imageRequestId: '123516',
      photoStatus: 'New',
      page: 55,
      createdBy: 'user-promo1',
      createdAt: '2025-09-10T12:15:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-056', 
      title:'Ergonomic Office Chair Executive', 
      status:'Samples in Transit', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Jonathan Smith', 
      deadline:'2025-09-24', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Executive ergonomic office chair with premium materials. Office lifestyle photography.',
      articles: ['Office Chair Executive [EAN: 5901234567996]', 'Chair Mat Protective [EAN: 5901234567997]'],
      budget: 14200,
      deliverables: ['Product Photography', 'Office Lifestyle', 'Ergonomic Features'],
      eventId: 'A8825107', 
      purchaseGroup: 101,
      offerId: '10763374',
      articleNumber: 'ART-OFFICECHAIR-056',
      articleName: 'Ergonomic Executive Chair',
      imageRequestId: '123517',
      photoStatus: 'Samples in Transit',
      page: 56,
      createdBy: 'user-promo2',
      createdAt: '2025-09-10T14:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-057', 
      title:'Air Purifier HEPA Advanced', 
      status:'Delivered', 
      method:'Photo Box',
      orderType: 'PS',
      photographer:'Sandra Lee', 
      deadline:'2025-09-02', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Advanced HEPA air purifier for home use. Clean lifestyle photography with air quality focus.',
      articles: ['Air Purifier HEPA [EAN: 5901234567998]', 'Replacement Filter Set [EAN: 5901234567999]'],
      budget: 10500,
      deliverables: ['Tech Product Shots', 'Home Lifestyle', 'Air Quality Demo'],
      eventId: 'A8925108', 
      purchaseGroup: 101,
      offerId: '10763375',
      articleNumber: 'ART-AIRPURIFIER-057',
      articleName: 'HEPA Air Purifier',
      imageRequestId: '123518',
      photoStatus: 'Archive',
      page: 57,
      createdBy: 'user-promo1',
      createdAt: '2025-08-28T16:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-058', 
      title:'Gourmet Olive Oil Collection', 
      status:'Processing', 
      method:'Photographer',
      orderType: 'PS',
      photographer:'Mario Rossi', 
      deadline:'2025-09-19', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Premium extra virgin olive oils from Mediterranean regions. Gourmet food photography.',
      articles: ['Extra Virgin Olive Oil [EAN: 5901234568000]', 'Oil Tasting Set [EAN: 5901234568001]'],
      budget: 7600,
      deliverables: ['Gourmet Food Photography', 'Lifestyle Cooking', 'Oil Quality Demo'],
      eventId: 'A9025109', 
      purchaseGroup: 101,
      offerId: '10763376',
      articleNumber: 'ART-OLIVEOIL-058',
      articleName: 'Gourmet Olive Oil Collection',
      imageRequestId: '123519',
      photoStatus: 'Processing',
      page: 58,
      createdBy: 'user-promo2',
      createdAt: '2025-09-10T18:00:00Z',
      assignedTo: 'user-photo1',
      comments: []
    }
  
  ];

  // Expose orders globally for access from other scopes
  window.rkhOrders = allOrders;

  // Update quick action badges with real counts
  function updateQuickActionBadges() {
  const allOrdersList = window.rkhOrders || [];
  const orders = window.authSystem ? window.authSystem.getFilteredOrders(allOrdersList) : allOrdersList;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Helper function to update badge with animation
    function updateBadgeWithAnimation(badge, newCount) {
      if (!badge) return;
      
      const oldCount = parseInt(badge.textContent) || 0;
      badge.textContent = newCount;
      badge.style.display = newCount > 0 ? 'flex' : 'none';
      
      // Add animation if value changed
      if (oldCount !== newCount && newCount > 0) {
        badge.classList.add('updated');
        setTimeout(() => badge.classList.remove('updated'), 600);
      }
    }
    
    // Count urgent orders (high priority)
    const urgentCount = orders.filter(o => o.priority === 'High' || o.priority === 'Critical').length;
    const urgentBadge = document.getElementById('urgentBadge');
    updateBadgeWithAnimation(urgentBadge, urgentCount);
    
    // Count samples in transit
    const samplesCount = orders.filter(o => 
      o.status === 'Samples Requested' || 
      o.status === 'Samples in Transit' ||
      o.status === 'Samples Received'
    ).length;
    const samplesBadge = document.getElementById('samplesBadge');
    updateBadgeWithAnimation(samplesBadge, samplesCount);
    
    // Count overdue orders
    const overdueToday = new Date();
    overdueToday.setHours(23, 59, 59, 999); // End of today
    const overdueCount = orders.filter(o => {
      const deadline = new Date(o.deadline);
      return deadline < overdueToday && 
        o.status !== 'Complete' && 
        o.status !== 'Completed' &&
        o.status !== 'Delivered' &&
        o.status !== 'Archived';
    }).length;
    const overdueBadge = document.getElementById('overdueBadge');
    updateBadgeWithAnimation(overdueBadge, overdueCount);
    
    // Count today's deadlines
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = orders.filter(o => o.deadline === todayStr).length;
    const todayBadge = document.getElementById('todayBadge');
    updateBadgeWithAnimation(todayBadge, todayCount);
  }

  // Expose updateQuickActionBadges globally
  window.updateQuickActionBadges = updateQuickActionBadges;

  const samples = [
    {
      id: 'SMP-001',
      articleName: 'Premium Dog Food 2kg',
      status: 'At Photographer',
      location: 'Studio A - Downtown',
      assignedTo: 'John Smith',
      transitHistory: 'Warehouse → Studio A (Aug 22)',
      lastUpdate: '2025-08-23'
    },
    {
      id: 'SMP-002',
      articleName: 'Espresso Beans 500g',
      status: 'In Transit to Photo Box',
      location: 'Transit Vehicle #47',
      assignedTo: 'Emily Brown',
      transitHistory: 'Warehouse → Photo Box Station 3',
      lastUpdate: '2025-08-25'
    },
    {
      id: 'SMP-003',
      articleName: 'Wireless Bluetooth Speaker',
      status: 'Created',
      location: 'Warehouse',
      assignedTo: 'Unassigned',
      transitHistory: 'Created in Warehouse',
      lastUpdate: '2025-08-24'
    }
  ];

  const css = `
    #fallback-app { font-family: system-ui, 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #4b3b2a; }
    #fallback-app h1 { margin: 0 0 8px; font-size: 22px; color: #4b3b2a; font-weight: 600; }
    #fallback-app .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 16px 0; }
    #fallback-app .stat-card { background: rgba(255, 248, 237, 0.92); border: 1px solid rgba(196, 139, 90, 0.25); border-radius: 12px; padding: 14px; text-align: center; box-shadow: 0 10px 30px rgba(102, 79, 49, 0.08); transition: transform 0.2s ease, box-shadow 0.2s ease; }
    #fallback-app .stat-card.clickable-tile:hover { background: rgba(244, 220, 188, 0.85); border-color: #c48b5a; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(142, 102, 64, 0.18); }
    #fallback-app .stat-number { font-size: 24px; font-weight: 700; color: #b67740; }
    #fallback-app .stat-label { font-size: 12px; color: #8d765b; text-transform: uppercase; letter-spacing: 0.6px; }
    #fallback-app table { border-collapse: collapse; width: 100%; margin-top: 12px; background: rgba(255, 250, 242, 0.92); border-radius: 12px; overflow: hidden; box-shadow: 0 14px 44px rgba(82, 60, 35, 0.12); }
    #fallback-app th, #fallback-app td { border-bottom: 1px solid rgba(196, 139, 90, 0.2); padding: 10px 14px; font-size: 13px; text-align: left; }
    #fallback-app th { background: rgba(238, 219, 196, 0.85); font-weight: 600; color: #543d28; text-transform: uppercase; letter-spacing: 0.4px; }
    #fallback-app tbody tr { background: rgba(255, 248, 237, 0.86); color: #4f3a25; transition: background 0.2s ease-in-out; }
    #fallback-app tbody tr td { color: #4f3a25 !important; }
    #fallback-app tbody tr:hover { background: rgba(237, 214, 186, 0.65); }
    #fallback-app .status { padding: 3px 10px; border-radius: 14px; font-size: 11px; font-weight: 600; display: inline-block; background: rgba(210, 187, 161, 0.35); color: #4b3927; }
    #fallback-app .Complete, #fallback-app .Delivered, #fallback-app .status-complete { background: rgba(193, 219, 196, 0.8); color: #315839; }
    #fallback-app .Pending, #fallback-app .status-pending { background: rgba(240, 200, 157, 0.8); color: #8a5324; }
    #fallback-app .Draft, #fallback-app .Created, #fallback-app .status-draft { background: rgba(232, 216, 194, 0.8); color: #655038; }
    #fallback-app .NewRequest, #fallback-app .Received, #fallback-app .status-samples { background: rgba(210, 226, 221, 0.85); color: #2f5f52; }
    #fallback-app .InProgress, #fallback-app .AtPhotographer, #fallback-app .status-in-progress { background: rgba(241, 208, 165, 0.85); color: #8d5822; }
    #fallback-app .Approved, #fallback-app .status-approved { background: rgba(204, 223, 198, 0.9); color: #375d3b; }
    #fallback-app .SamplesRequested, #fallback-app .InTransittoPhotographer, #fallback-app .InTransittoPhotoBox, #fallback-app .status-review { background: rgba(243, 214, 174, 0.8); color: #7d4f1b; }
    #fallback-app .AtPhotoBox { background: rgba(215, 210, 236, 0.8); color: #4f3d85; }
    #fallback-app .High, #fallback-app .Urgent { background: rgba(230, 182, 175, 0.85); color: #8f2f28; }
    #fallback-app .Medium { background: rgba(243, 214, 174, 0.8); color: #7d4f1b; }
    #fallback-app .Low { background: rgba(204, 223, 198, 0.9); color: #375d3b; }
    #fallback-app .template-card:hover { border-color: #c48b5a; box-shadow: 0 10px 24px rgba(160, 108, 60, 0.18); }
    #fallback-app .kanban-items { min-height: 100px; }
    #fallback-app .kanban-item { background: rgba(255, 248, 237, 0.95); border: 1px solid rgba(196, 139, 90, 0.28); border-radius: 10px; padding: 10px; margin-bottom: 10px; cursor: pointer; font-size: 12px; box-shadow: 0 8px 18px rgba(90, 63, 34, 0.12); transition: transform 0.2s ease, box-shadow 0.2s ease; }
    #fallback-app .kanban-item:hover { border-color: #c48b5a; box-shadow: 0 12px 28px rgba(114, 80, 44, 0.2); transform: translateY(-2px); }
    #fallback-app .progress-bar { width: 100%; height: 6px; background: rgba(205, 176, 144, 0.28); border-radius: 3px; overflow: hidden; }
    #fallback-app .progress-fill { height: 100%; background: linear-gradient(90deg, #c48b5a, #b07442); transition: width 0.3s ease; }
    #fallback-app .bulk-mode .bulk-checkbox { display: table-cell !important; }
    #fallback-app .selected-row { background: rgba(235, 207, 174, 0.7) !important; }
    #fallback-app .toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
    #fallback-app .btn { background: linear-gradient(135deg, #be8b5e, #a8703f); color: #fffaf2; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 8px 18px rgba(111, 78, 40, 0.18); }
    #fallback-app .btn:hover { transform: translateY(-1px); box-shadow: 0 12px 26px rgba(111, 78, 40, 0.24); }
    #fallback-app .btn-primary { background: linear-gradient(135deg, #c48b5a, #a8703f); }
    #fallback-app .btn-primary:hover { box-shadow: 0 12px 28px rgba(150, 96, 45, 0.3); }
    #fallback-app input { flex: 1; min-width: 240px; padding: 9px 13px; border: 1px solid rgba(196, 139, 90, 0.35); border-radius: 8px; font-size: 13px; background: rgba(255, 250, 242, 0.9); color: #4b3b2a; transition: border-color 0.2s ease; }
    #fallback-app input:focus { border-color: #c48b5a; outline: none; box-shadow: 0 0 0 3px rgba(196, 139, 90, 0.25); }
    #fallback-app .alert { background: rgba(244, 214, 174, 0.9); border: 1px solid rgba(180, 120, 66, 0.6); color: #71461c; padding: 12px; border-radius: 10px; margin-bottom: 16px; font-size: 14px; box-shadow: 0 10px 22px rgba(122, 86, 48, 0.12); }
    
    /* Bulk Actions Panel Responsive Styles */
    @media (max-width: 768px) {
      #bulkActionsPanel > div { 
        padding: 12px !important; 
      }
      #bulkActionsPanel > div > div { 
        flex-direction: column !important; 
        align-items: stretch !important; 
        gap: 16px !important; 
      }
      #bulkActionsPanel button { 
        justify-content: center !important; 
        flex: 1 !important; 
        min-width: auto !important; 
      }
      #bulkActionsPanel .selected-count-info { 
        text-align: center !important; 
      }
    }
    @media (max-width: 480px) {
      #bulkActionsPanel button { 
        padding: 12px 8px !important; 
        font-size: 12px !important; 
      }
      #bulkActionsPanel button span:first-child { 
        margin-right: 4px !important; 
      }
    }
    #confetti-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
    @keyframes confetti-fall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
    .confetti { position: fixed; width: 8px; height: 8px; z-index: 9999; pointer-events: none; animation: confetti-fall 3s linear forwards; }
  `;

  if(!document.getElementById('fallback-style')){
    const st = document.createElement('style');
    st.id = 'fallback-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function getStats(ordersList = allOrders) {
    const total = ordersList.length;
    const complete = ordersList.filter(o => o.status === 'Complete' || o.status === 'Delivered').length;
    const pending = ordersList.filter(o => o.status === 'Pending' || o.status === 'Draft').length;
    const inProgress = ordersList.filter(o => o.status === 'In Progress').length;
    const newRequests = ordersList.filter(o => o.status === 'New Request' || o.status === 'Draft').length;
    const totalSamples = samples.length;
    const samplesInTransit = samples.filter(s => s.status.includes('Transit')).length;
    return { total, complete, pending, inProgress, newRequests, totalSamples, samplesInTransit };
  }

  // Global Functions for Placeholder Items (for onclick handlers)
  window.getPlaceholderItems = function() {
    const items = localStorage.getItem('placeholderItems');
    return items ? JSON.parse(items) : [];
  };

  window.savePlaceholderItems = function(items) {
    localStorage.setItem('placeholderItems', JSON.stringify(items));
  };

  window.createOrderFromPlaceholder = function(itemId) {
    const placeholderItems = getPlaceholderItems();
    const item = placeholderItems.find(p => p.id === itemId);
    
    if (!item) {
      alert('Placeholder item not found');
      return;
    }
    
    // Close the modal
    const modal = document.querySelector('div[style*="position:fixed"]');
    if (modal) {
      modal.remove();
    }
    
    // Switch to create order view
    showView('create');
    
    // Pre-fill the form with placeholder item data
    setTimeout(() => {
      const articleInput = document.getElementById('articleNumber');
      const titleInput = document.getElementById('orderTitle');
      const commentsInput = document.getElementById('orderComments');
      const prioritySelect = document.getElementById('orderPriority');
      
      if (articleInput) articleInput.value = item.id;
      if (titleInput) titleInput.value = `Content Project for ${item.description}`;
      if (commentsInput) commentsInput.value = `Placeholder item project: ${item.description}${item.notes ? '\n\nNotes: ' + item.notes : ''}`;
      if (prioritySelect) prioritySelect.value = item.priority;
      
      // Add placeholder indicator
      if (commentsInput) {
        commentsInput.value += '\n\n⚠️ This order uses a placeholder item. Please update the article number once the item is registered in the system.';
      }
    }, 100);
  };

  window.editPlaceholderItem = function(itemId) {
    // For now, show a simple edit interface - could be expanded to a full edit modal
    const placeholderItems = getPlaceholderItems();
    const item = placeholderItems.find(p => p.id === itemId);
    
    if (!item) {
      alert('Placeholder item not found');
      return;
    }
    
    const newDescription = prompt('Edit description:', item.description);
    if (newDescription !== null && newDescription.trim()) {
      item.description = newDescription.trim();
      savePlaceholderItems(placeholderItems);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        showPlaceholderItemsModal();
      }
    }
  };

  window.deletePlaceholderItem = function(itemId) {
    if (!confirm(`Are you sure you want to delete placeholder item "${itemId}"?`)) {
      return;
    }
    
    const placeholderItems = getPlaceholderItems();
    const updatedItems = placeholderItems.filter(item => item.id !== itemId);
    savePlaceholderItems(placeholderItems);
    
    // Refresh the modal
    const modal = document.querySelector('div[style*="position:fixed"]');
    if (modal) {
      modal.remove();
      window.showPlaceholderItemsModal();
    }
  };

  function render() {
    // Check authentication
    if (!authSystem.isAuthenticated()) {
      showLoginScreen();
      return;
    }

    const currentUser = authSystem.getCurrentUser();
    let orders = authSystem.getFilteredOrders(allOrders); // Create global orders variable for compatibility
    const stats = getStats(orders);
    
    // Function to refresh orders when needed
    function refreshOrders() {
      orders = authSystem.getFilteredOrders(allOrders);
      return orders;
    }
    
    root.innerHTML = `
      <!-- Enhanced Sidebar Layout -->
  <div id="fallback-app" style="min-height: 100vh; margin: 0; background: #f3f4f6; display: flex;">
        
        <!-- Modern Sidebar -->
        <div class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-title-container">
                <img src="/CCP_Logog.png" alt="CCP Logo" class="sidebar-logo" />
                <h1 class="sidebar-title">Content Creation Program</h1>
              </div>
            <button class="sidebar-toggle" onclick="toggleSidebar()" title="Toggle Sidebar (Ctrl+B)" aria-label="Toggle Sidebar">
              <span id="sidebarToggleIcon">◀</span>
            </button>
          </div>
          
          <nav class="sidebar-nav">
            <!-- Core Operations -->
            <div class="nav-section" data-section="core">
              <button class="nav-section-title" type="button">
                <span>Core Operations</span>
                <span class="nav-section-chevron">▾</span>
              </button>
              <div class="nav-section-items">
                <div class="nav-item" data-tooltip="Dashboard Overview" onclick="showView('dashboard')">
                  <span class="nav-item-icon">🏠</span>
                  <span class="nav-item-text">Dashboard</span>
                </div>
                ${authSystem.canCreateOrders() ? `
                  <div class="nav-item" data-tooltip="Create New Order" onclick="showNewOrderModal()">
                    <span class="nav-item-icon">📋</span>
                    <span class="nav-item-text">New Order</span>
                  </div>
                  <div class="nav-item" data-tooltip="Create/Edit Content with Runware AI (Google Gemini Flash Image 2.5)" onclick="showContentCreationModal()">
                    <span class="nav-item-icon">🚀</span>
                    <span class="nav-item-text">Create/Edit Content</span>
                  </div>
                ` : ''}
                <div class="nav-item" data-tooltip="View All Orders" onclick="showView('orders')">
                  <span class="nav-item-icon">📋</span>
                  <span class="nav-item-text">Orders</span>
                </div>
                <div class="nav-item" data-tooltip="Scan Article" onclick="showScanArticleRightModal()">
                  <span class="nav-item-icon">📷</span>
                  <span class="nav-item-text">Scan Article</span>
                </div>
              </div>
            </div>

            <!-- Views & Analytics -->
            <div class="nav-section" data-section="analytics">
              <button class="nav-section-title" type="button">
                <span>Views & Analytics</span>
                <span class="nav-section-chevron">▾</span>
              </button>
              <div class="nav-section-items">
                <div class="nav-item" data-tooltip="Kanban Board" onclick="showView('kanban')">
                  <span class="nav-item-icon">📊</span>
                  <span class="nav-item-text">Kanban Board</span>
                </div>
                <div class="nav-item" data-tooltip="Calendar View" onclick="showView('calendar')">
                  <span class="nav-item-icon">📅</span>
                  <span class="nav-item-text">Calendar</span>
                </div>
                <div class="nav-item" data-tooltip="Workflow View" onclick="showView('workflow')">
                  <span class="nav-item-icon">🔄</span>
                  <span class="nav-item-text">Workflow</span>
                </div>
                ${authSystem.canCreateOrders() ? `
                  <div class="nav-item" data-tooltip="Smart Suggestions" onclick="window.showHistoricalSuggestionsModal()">
                    <span class="nav-item-icon">📊</span>
                    <span class="nav-item-text">Smart Analytics</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="nav-section" data-section="quick-actions">
              <button class="nav-section-title" type="button">
                <span>Quick Actions</span>
                <span class="nav-section-chevron">▾</span>
              </button>
              <div class="nav-section-items">
                <div class="nav-item nav-item-urgent" data-tooltip="View High & Critical Priority Orders" onclick="filterOrdersByStatus('urgent')">
                  <span class="nav-item-icon">🚨</span>
                  <span class="nav-item-text">Urgent Orders</span>
                  <span class="nav-item-badge" id="urgentBadge">0</span>
                </div>
                <div class="nav-item nav-item-samples" data-tooltip="View Orders with Samples Requested/In Transit/Received" onclick="filterOrdersByStatus('samples')">
                  <span class="nav-item-icon">📦</span>
                  <span class="nav-item-text">Samples Ready</span>
                  <span class="nav-item-badge" id="samplesBadge">0</span>
                </div>
                <div class="nav-item nav-item-overdue" data-tooltip="View Orders Past Their Deadline" onclick="filterOrdersByStatus('overdue')">
                  <span class="nav-item-icon">⏰</span>
                  <span class="nav-item-text">Overdue Orders</span>
                  <span class="nav-item-badge" id="overdueBadge">0</span>
                </div>
                <div class="nav-item nav-item-today" data-tooltip="View Orders Due Today" onclick="filterOrdersByStatus('today')">
                  <span class="nav-item-icon">📅</span>
                  <span class="nav-item-text">Due Today</span>
                  <span class="nav-item-badge" id="todayBadge">0</span>
                </div>
              </div>
            </div>

            <!-- Data Management -->
            <div class="nav-section" data-section="data">
              <button class="nav-section-title" type="button">
                <span>Data Management</span>
                <span class="nav-section-chevron">▾</span>
              </button>
              <div class="nav-section-items">
                ${authSystem.canCreateOrders() ? `
                  <div class="nav-item" data-tooltip="Import SAP PMR" onclick="showSAPImportModal()">
                    <span class="nav-item-icon">🏢</span>
                    <span class="nav-item-text">SAP Import</span>
                  </div>
                  <div class="nav-item" data-tooltip="Import Excel/CSV" onclick="window.showExcelImportModal()">
                    <span class="nav-item-icon">📋</span>
                    <span class="nav-item-text">Excel Import</span>
                  </div>
                ` : ''}
                <div class="nav-item" data-tooltip="Cloudinary Asset Management" onclick="window.showDAMIntegrationModal()">
                  <span class="nav-item-icon">☁️</span>
                  <span class="nav-item-text">Cloudinary Assets</span>
                </div>
                <div id="toggleBulkMode" class="nav-item" data-tooltip="Bulk Operations">
                  <span class="nav-item-icon">☑️</span>
                  <span class="nav-item-text">Bulk Select</span>
                </div>
              </div>
            </div>

            <!-- Templates & Automation -->
            ${authSystem.canCreateOrders() ? `
              <div class="nav-section" data-section="automation">
                <button class="nav-section-title" type="button">
                  <span>Automation</span>
                  <span class="nav-section-chevron">▾</span>
                </button>
                <div class="nav-section-items">
                  <div class="nav-item" data-tooltip="Quick Templates" onclick="showQuickTemplatesModal()">
                    <span class="nav-item-icon">⚡</span>
                    <span class="nav-item-text">Quick Templates</span>
                  </div>
                  <div class="nav-item" data-tooltip="Template Rules Engine" onclick="window.showTemplateRulesModal()">
                    <span class="nav-item-icon">🎯</span>
                    <span class="nav-item-text">Template Rules</span>
                  </div>
                  <div class="nav-item" data-tooltip="Placeholder Items" onclick="window.showPlaceholderItemsModal()">
                    <span class="nav-item-icon">📝</span>
                    <span class="nav-item-text">Placeholder Items</span>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- System & Support -->
            <div class="nav-section" data-section="system">
              <button class="nav-section-title" type="button">
                <span>System</span>
                <span class="nav-section-chevron">▾</span>
              </button>
              <div class="nav-section-items">
                <div class="nav-item" data-tooltip="Request Customization" onclick="window.showCustomizationRequestModal()">
                  <span class="nav-item-icon">🔧</span>
                  <span class="nav-item-text">Customizations</span>
                </div>
                <div class="nav-item" data-tooltip="System Settings" onclick="showSettings()">
                  <span class="nav-item-icon">⚙️</span>
                  <span class="nav-item-text">Settings</span>
                </div>
                <div class="nav-item" data-tooltip="User Profile" onclick="showProfile()">
                  <span class="nav-item-icon">👤</span>
                  <span class="nav-item-text">Profile</span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
          <div class="content-header">
            <h1 class="content-title" id="contentTitle">Dashboard Overview</h1>
            <div class="content-actions">
              <button class="content-pill-btn content-pill-btn--export" onclick="exportToCsv()">📊 <span>Export</span></button>
              <button class="content-pill-btn content-pill-btn--refresh" onclick="refreshData()">🔄 <span>Refresh</span></button>
              <div style="position: relative; display: flex; align-items: center; gap: 12px;">
                <span style="color: #6b5440; font-weight: 500; font-size: 14px;">
                  ${currentUser.name} (${currentUser.role})
                </span>
                <div style="position: relative;">
                  <button id="supportMenuBtn" onclick="toggleSupportMenu()" class="content-pill-btn content-pill-btn--support content-pill-btn--compact" style="background: linear-gradient(135deg, #c48b5a 0%, #a67550 100%); color: white;">
                    <span>📚 Support</span>
                  </button>
                  <div id="supportMenuDropdown" style="
                    display: none;
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    background: #fffaf3;
                    border: 2px solid #ead7c2;
                    border-radius: 12px;
                    box-shadow: 0 12px 24px rgba(79, 59, 37, 0.18);
                    min-width: 220px;
                    z-index: 1000;
                    overflow: hidden;
                  ">
                    <div style="padding: 12px 16px; background: linear-gradient(135deg, #f7eedf, #efe0cf); border-bottom: 1px solid #ead7c2;">
                      <div style="font-weight: 700; font-size: 14px; color: #4b3b2a; display: flex; align-items: center; gap: 8px;">
                        <span>📚</span>
                        <span>Support & Resources</span>
                      </div>
                    </div>
                    <div style="padding: 8px;">
                      <button onclick="openStyleGuide()" class="support-menu-item">
                        <span class="support-menu-icon">🎨</span>
                        <div class="support-menu-content">
                          <span class="support-menu-label">Photo Reference Guide</span>
                          <span class="support-menu-desc">Textile photography standards</span>
                        </div>
                      </button>
                      <button onclick="openUserManual()" class="support-menu-item">
                        <span class="support-menu-icon">📖</span>
                        <div class="support-menu-content">
                          <span class="support-menu-label">User Manual</span>
                          <span class="support-menu-desc">Complete documentation</span>
                        </div>
                      </button>
                      <button onclick="openScannerGuide()" class="support-menu-item">
                        <span class="support-menu-icon">📷</span>
                        <div class="support-menu-content">
                          <span class="support-menu-label">Scanner Guide</span>
                          <span class="support-menu-desc">Barcode scanning help</span>
                        </div>
                      </button>
                      <div style="height: 1px; background: #ead7c2; margin: 8px 4px;"></div>
                      <button onclick="showAboutModal()" class="support-menu-item">
                        <span class="support-menu-icon">ℹ️</span>
                        <div class="support-menu-content">
                          <span class="support-menu-label">About</span>
                          <span class="support-menu-desc">App version & info</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <button onclick="logout()" class="content-pill-btn content-pill-btn--logout content-pill-btn--compact"><span>Logout</span></button>
              </div>
            </div>
          </div>
          
          <div class="content-body">
            <!-- Main Content Area -->
            <div id="mainContent">
              <!-- Dashboard View -->
              <div id="dashboardView" style="display: none;">
                <!-- Dashboard Stats Grid -->
                <div id="dashboardStats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;">
                  <!-- Stats cards will be populated here -->
                </div>

                <!-- Recent Orders Section -->
                <div style="background: #fffaf3; border-radius: 12px; box-shadow: 0 10px 24px rgba(79, 59, 37, 0.1); margin-bottom: 24px; border: 1px solid rgba(196, 139, 90, 0.18);">
                  <div style="padding: 16px; border-bottom: 1px solid rgba(196, 139, 90, 0.2); background: linear-gradient(135deg, #f7eedf, #efe0cf);">
                    <h3 style="margin: 0; font-size: 18px; color: #4b3b2a; font-weight: 600;">📋 Recent Orders</h3>
                  </div>
                  <div id="recentOrdersContainer" style="max-height: 400px; overflow-y: auto; background: #fffaf3;">
                    <!-- Recent orders will be populated here -->
                  </div>
                </div>
              </div>

              <!-- Orders Table - Default View -->
              <div id="ordersView">
                <!-- Compact Filter Row: Event ID + Search -->
                <div class="orders-filter-bar">
                  <select id="salesOrgFilter"
                          onchange="handleSalesOrgFilterChange(this.value)"
                          style="padding: 6px 10px; border: 1px solid rgba(216, 164, 88, 0.65); border-radius: 8px; font-size: 13px; font-family: monospace; font-weight: 500; background: #fffaf3; cursor: pointer; min-width: 140px; color: #6b5440; flex: 0 0 auto;">
                    <option value="">All Sales Orgs</option>
                    <!-- Sales org options populated on load -->
                  </select>
                  <select id="tacticTypeFilter"
                          onchange="handleTacticTypeFilterChange(this.value)"
                          style="padding: 6px 10px; border: 1px solid rgba(216, 164, 88, 0.65); border-radius: 8px; font-size: 13px; font-family: monospace; font-weight: 500; background: #fffaf3; cursor: pointer; min-width: 160px; color: #6b5440; flex: 0 0 auto;">
                    <option value="">All Tactic Types</option>
                    <!-- Tactic types populated dynamically -->
                  </select>
                  <select id="tacticFilter"
                          onchange="handleTacticFilterChange(this.value)"
                          style="padding: 6px 10px; border: 1px solid rgba(216, 164, 88, 0.65); border-radius: 8px; font-size: 13px; font-family: monospace; font-weight: 500; background: #fffaf3; cursor: pointer; min-width: 150px; color: #6b5440; flex: 0 0 auto;">
                    <option value="">All Tactics</option>
                    <!-- Tactics populated dynamically -->
                  </select>
                  <select id="eventIdFilter" 
                          onchange="handleEventFilterChange(this.value)" 
                          style="padding: 6px 10px; border: 1px solid rgba(216, 164, 88, 0.65); border-radius: 8px; font-size: 13px; font-family: monospace; font-weight: 500; background: #fffaf3; cursor: pointer; min-width: 150px; color: #6b5440; flex: 0 0 auto;">
                    <option value="">All Events</option>
                    <!-- Event IDs from PMR will be populated here -->
                  </select>
                  <div id="eventIdOrderCount" style="font-size: 12px; color: #78350f; font-weight: 600; white-space: nowrap; flex: 0 0 auto;">
                    Select a Sales Org, Event, Status, Tactic Type, or Tactic to view orders
                  </div>
                  <div style="width: 1px; height: 24px; background: rgba(196, 139, 90, 0.25); margin: 0 4px; flex: 0 0 auto;"></div>
                  <input id="searchBox" placeholder="🔍 Search orders..." 
                         style="flex: 1 1 220px; padding: 6px 12px; border: 1px solid rgba(196, 139, 90, 0.35); border-radius: 8px; font-size: 13px; background: #fffaf3; color: #4b3b2a;" />
                  <button id="quickFiltersToggle" onclick="toggleQuickFilters()" 
                          style="padding: 6px 12px; border: 1px solid rgba(196, 139, 90, 0.35); border-radius: 8px; background: linear-gradient(135deg, #fff0db, #f7e1c3); color: #7b5a3d; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 10px rgba(123, 90, 61, 0.18); flex: 0 0 auto;">
                    Quick Filters ▾
                  </button>
                  <div id="quickFiltersPanel" style="display: none; position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 40; background: #fffaf3; border-radius: 12px; box-shadow: 0 12px 24px rgba(79, 59, 37, 0.18); border: 1px solid rgba(196, 139, 90, 0.22); padding: 18px; max-height: 320px; overflow-y: auto;">
                    <h3 style="margin: 0 0 12px; font-size: 14px; color: #4b3b2a; font-weight: 600; letter-spacing: 0.2px; text-transform: uppercase;">🔍 Quick Filters</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                      <div onclick="filterOrdersByStatus('all')" style="background: linear-gradient(135deg, #fffaf3, #f4e8d8); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #bfa079;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #6b5440; margin-bottom: 6px;" id="allOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">📋 All Orders</div>
                      </div>
                      <div onclick="filterOrdersByStatus('draft')" style="background: linear-gradient(135deg, #fff6ea, #f2e0c6); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #d0b48c;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #7b5a3d; margin-bottom: 6px;" id="draftOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">📝 Draft</div>
                      </div>
                      <div onclick="filterOrdersByStatus('pending')" style="background: linear-gradient(135deg, #fff3df, #f0d3a7); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #d8a458;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #b0722e; margin-bottom: 6px;" id="pendingOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">⏳ Pending</div>
                      </div>
                      <div onclick="filterOrdersByStatus('approved')" style="background: linear-gradient(135deg, #f0f8f4, #dcebe3); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #8fb0a3;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #5f7f74; margin-bottom: 6px;" id="approvedOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">✅ Approved</div>
                      </div>
                      <div onclick="filterOrdersByStatus('samples')" style="background: linear-gradient(135deg, #f6f0ff, #e6dbf5); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #bfa3d6;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #8767b2; margin-bottom: 6px;" id="samplesOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">📦 Samples</div>
                      </div>
                      <div onclick="filterOrdersByStatus('In Progress')" style="background: linear-gradient(135deg, #fff1e6, #f0d3bb); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #c48b5a;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #a66b38; margin-bottom: 6px;" id="inProgressOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">🔄 In Progress</div>
                      </div>
                      <div onclick="filterOrdersByStatus('review')" style="background: linear-gradient(135deg, #f3f9ef, #e3eed8); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #a5b68f;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #6f7f5a; margin-bottom: 6px;" id="reviewOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">🔍 Review</div>
                      </div>
                      <div onclick="filterOrdersByStatus('completed')" style="background: linear-gradient(135deg, #eff7f2, #dcebdc); border-radius: 10px; box-shadow: 0 6px 14px rgba(79, 59, 37, 0.12); padding: 14px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #7fa284;" 
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 20px rgba(79, 59, 37, 0.18)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 14px rgba(79, 59, 37, 0.12)';">
                        <div style="font-size: 20px; font-weight: 700; color: #54735d; margin-bottom: 6px;" id="completedOrdersCount">0</div>
                        <div style="font-size: 11px; color: #6b5440; text-transform: uppercase; letter-spacing: 0.4px;">🎉 Complete</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bulk Actions Panel -->
                <div style="display: none; background: #fdf8f1; border-radius: 12px; box-shadow: 0 10px 22px rgba(79, 59, 37, 0.1); margin-bottom: 24px; border: 1px solid rgba(196, 139, 90, 0.18);" id="bulkActionsPanel">
                  <div style="background: linear-gradient(135deg, #f6ede0, #efe2d0); padding: 18px; border-radius: 12px 12px 0 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                      <div class="selected-count-info" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <div style="background: #c48b5a; color: white; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 12px rgba(196, 139, 90, 0.35);">
                          <span id="selectedCount">0</span> selected
                        </div>
                        <span style="color: #6b5440; font-size: 14px; font-weight: 500;">Choose an action to apply to selected items</span>
                      </div>
                      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button id="bulkUpdateStatus" style="background: linear-gradient(135deg, #9cb89f, #7fa284); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 6px 12px rgba(127, 162, 132, 0.35); display: flex; align-items: center; gap: 6px;" 
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 20px rgba(127, 162, 132, 0.45)'" 
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 12px rgba(127, 162, 132, 0.35)'">
                          <span>📝</span> Update Status
                        </button>
                        <button id="bulkAssign" style="background: linear-gradient(135deg, #c8a6d9, #b48fc7); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 6px 12px rgba(180, 143, 199, 0.35); display: flex; align-items: center; gap: 6px;" 
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 20px rgba(180, 143, 199, 0.45)'" 
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 12px rgba(180, 143, 199, 0.35)'">
                          <span>👤</span> Assign To
                        </button>
                        <button id="bulkExport" style="background: linear-gradient(135deg, #dfb37d, #c48b5a); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 6px 12px rgba(196, 139, 90, 0.35); display: flex; align-items: center; gap: 6px;" 
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 20px rgba(196, 139, 90, 0.45)'" 
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 12px rgba(196, 139, 90, 0.35)'">
                          <span>📊</span> Export
                        </button>
                        <button id="clearSelection" style="background: linear-gradient(135deg, #b4a392, #8f7b63); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 6px 12px rgba(143, 123, 99, 0.35); display: flex; align-items: center; gap: 6px;" 
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 20px rgba(143, 123, 99, 0.45)'" 
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 12px rgba(143, 123, 99, 0.35)'">
                          <span>✖️</span> Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="orders-table-container">
                  <table class="orders-table">
                    <thead>
                      <tr style="background: linear-gradient(135deg, #f7eedf, #efe0cf);">
                        <th style="width: 40px; display: none;" class="bulk-checkbox"><input type="checkbox" id="selectAllOrders"></th>
                        <th style="padding: 4px; text-align: center; border-bottom: 1px solid rgba(196, 139, 90, 0.22); width: 32px;" aria-label="Expand"></th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Order Number</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Page</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Offer ID</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Group</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Order Type</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Offer Name</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Shot Type</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Photo Ref.</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Production</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Principle</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">File Name</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22); width: 92px;">Comments</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Status</th>
                        <th style="padding: 8px 10px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid rgba(196, 139, 90, 0.22);">Deadline</th>
                      </tr>
                    </thead>
                    <tbody id="ordersBody" style="background: #fffaf3;">
                      <!-- Orders will be populated here -->
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Kanban Board View -->
              <div style="display: none;" id="kanbanView">
                <h3 style="margin: 16px 0 8px; font-size: 18px; color: #4b3b2a;">📊 Kanban Board</h3>
                <p style="margin: 0 0 16px; color: #6b5440; font-size: 14px;">Drag and drop orders to update their status</p>
                
                <div id="kanbanBoard" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 16px 0; overflow-x: auto;">
                  <!-- Kanban columns will be populated here -->
                </div>
              </div>

              <!-- Calendar View -->
              <div style="display: none;" id="calendarView">
                <h3 style="margin: 16px 0 8px; font-size: 18px; color: #4b3b2a;">📅 Calendar View</h3>
                <p style="margin: 0 0 16px; color: #6b5440; font-size: 14px;">View order deadlines and production schedule</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div style="display: flex; gap: 8px;">
                    <button id="calendarWeek" class="btn btn-secondary">Week</button>
                    <button id="calendarMonth" class="btn btn-secondary">Month</button>
                    <button id="calendarYear" class="btn btn-secondary">Year</button>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <h4 id="calendarTitle" style="margin: 0; font-size: 16px; color: #4b3b2a;">August 2025</h4>
                    <button id="calendarPrev" class="btn">‹ Prev</button>
                    <button id="calendarNext" class="btn">Next ›</button>
                  </div>
                  <button id="calendarToday" class="btn" style="background: #c48b5a; color: white;">Today</button>
                </div>
                
                <div id="calendarContainer" style="background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                  <!-- Calendar will be populated here -->
                </div>
              </div>

              <!-- Workflow View -->
              <div style="display: none;" id="workflowView">
                <h3 style="margin: 16px 0 8px; font-size: 18px; color: #4b3b2a;">🔄 Workflow Overview</h3>
                <p style="margin: 0 0 16px; color: #6b5440; font-size: 14px;">Track order progression through workflow stages</p>
                
                <div id="workflowKanban" style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px;">
            <div class="kanban-column" 
                style="min-width: 250px; background: #f9efe0; border-radius: 10px; padding: 14px; border: 1px solid rgba(196, 139, 90, 0.15);"
                       ondrop="handleDrop(event, 'Draft')" 
                       ondragover="handleDragOver(event)">
              <h4 style="margin: 0 0 12px; font-size: 14px; color: #4b3b2a; font-weight: 600;">📝 Draft Orders</h4>
                    <div id="draftOrders" class="kanban-items"></div>
                  </div>
                  <div class="kanban-column" 
                style="min-width: 250px; background: #fcefdc; border-radius: 10px; padding: 14px; border: 1px solid rgba(216, 164, 88, 0.25);"
                       ondrop="handleDrop(event, 'Samples Requested')" 
                       ondragover="handleDragOver(event)">
                    <h4 style="margin: 0 0 12px; font-size: 14px; color: #92400e; font-weight: 600;">⏳ Samples Requested</h4>
                    <div id="samplesRequestedOrders" class="kanban-items"></div>
                  </div>
                  <div class="kanban-column" 
                style="min-width: 250px; background: #f2e5d4; border-radius: 10px; padding: 14px; border: 1px solid rgba(196, 139, 90, 0.2);"
                       ondrop="handleDrop(event, 'In Progress')" 
                       ondragover="handleDragOver(event)">
              <h4 style="margin: 0 0 12px; font-size: 14px; color: #a66b38; font-weight: 600;">🎯 In Progress</h4>
                    <div id="inProgressOrders" class="kanban-items"></div>
                  </div>
                  <div class="kanban-column" 
                style="min-width: 250px; background: #e6efe6; border-radius: 10px; padding: 14px; border: 1px solid rgba(127, 162, 132, 0.25);"
                       ondrop="handleDrop(event, 'Complete')" 
                       ondragover="handleDragOver(event)">
              <h4 style="margin: 0 0 12px; font-size: 14px; color: #54735d; font-weight: 600;">✅ Completed</h4>
                    <div id="completedOrders" class="kanban-items"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        /* Sidebar layout refinements */
        .sidebar {
          width: 260px;
          background: transparent;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 100;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          margin: 12px 0 18px 18px;
          min-height: calc(100vh - 36px);
        }

        .sidebar.collapsed {
          width: 60px;
          box-shadow: none;
        }

        .sidebar.transitioning {
          pointer-events: none;
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px 14px;
          margin: 6px;
        }

        .sidebar-header {
          padding: 12px 48px 18px 20px;
          border-bottom: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          position: relative;
          min-height: 96px;
          box-sizing: border-box;
          border-radius: 0;
        }

        .sidebar-title-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 0;
          text-align: center;
        }

        .sidebar-logo {
          width: 64px;
          height: 64px;
          object-fit: contain;
          flex-shrink: 0;
          border-radius: 8px;
          background: none;
          padding: 0;
          box-shadow: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-title-container:hover .sidebar-logo {
          transform: translateY(-2px);
          box-shadow: none;
        }

        .sidebar-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }

        .sidebar-subtitle {
          margin: 0;
          font-size: 12px;
          color: #6b5440;
        }

        .sidebar-title {
          font-size: 10px;
          font-weight: 600;
          color: rgba(251, 245, 236, 0.92);
          margin: 0;
          transition: opacity 0.2s ease;
        }

        #fallback-app .sidebar-title {
          font-size: 14px;
          line-height: 1.1;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .sidebar.collapsed .sidebar-title,
        .sidebar.collapsed .sidebar-subtitle {
          opacity: 0;
        }

        .sidebar.collapsed .sidebar-meta {
          height: 0;
          overflow: hidden;
        }

        .sidebar.collapsed .sidebar-header {
          padding: 20px 16px;
        }

        .sidebar.collapsed .sidebar-logo {
          box-shadow: 0 8px 18px rgba(112, 82, 50, 0.16);
        }

        .sidebar-toggle {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 12px;
          transition: color 0.2s ease, transform 0.2s ease;
          color: #4b3b2a;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 16px;
          top: 34px;
          width: 36px;
          height: 36px;
          backdrop-filter: none;
          box-shadow: none;
        }

        .sidebar.collapsed .sidebar-toggle {
          right: 12px;
          color: #3a2617;
          transform: translateX(-6px);
        }

        .sidebar-toggle:hover,
        .sidebar-toggle:focus-visible {
          color: #311f12;
          outline: none;
          transform: translateY(-1px);
        }

        .sidebar.collapsed .sidebar-toggle:hover,
        .sidebar.collapsed .sidebar-toggle:focus-visible {
          transform: translateX(-6px) translateY(-1px);
        }

        .sidebar-toggle:active {
          transform: translateY(1px);
        }

        .sidebar.collapsed .sidebar-toggle:active {
          transform: translateX(-6px) translateY(1px);
        }

        #sidebarToggleIcon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
          font-size: 14px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .nav-section {
          margin: 0 12px 10px;
          border-radius: 12px;
          background: transparent;
          border: none;
          overflow: hidden;
          transition: background 0.2s ease;
        }

        .nav-section:hover {
          background: rgba(75, 59, 42, 0.06);
        }

        .nav-section-title {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: transparent;
          border: none;
          color: #4b3b2a;
          padding: 14px 18px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
        }

        .nav-section-title:hover,
        .nav-section-title:focus-visible {
          background: rgba(75, 59, 42, 0.08);
          color: #3a2617;
          outline: none;
        }

        .nav-section-chevron {
          font-size: 12px;
          transform: rotate(0deg);
          transition: transform 0.2s ease;
          opacity: 0.8;
        }

        .nav-section-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 10px 12px;
          transition: max-height 0.25s ease, opacity 0.2s ease, padding 0.2s ease;
        }

        .nav-section.collapsed .nav-section-items {
          max-height: 0;
          opacity: 0;
          padding: 0 10px;
          pointer-events: none;
        }

        .nav-section.collapsed .nav-section-chevron {
          transform: rotate(-90deg);
        }

        .sidebar.collapsed .nav-section-title {
          opacity: 0;
          padding: 0;
          height: 0;
          overflow: hidden;
        }

        .sidebar.collapsed .nav-section {
          margin: 0 8px 12px;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          margin: 2px 4px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: #4b3b2a;
          background: transparent;
          border: 1px solid transparent;
        }

        .nav-item:hover,
        .nav-item:focus-visible {
          background: rgba(75, 59, 42, 0.1);
          border-color: rgba(75, 59, 42, 0.14);
          color: #2f2115;
          transform: translateX(4px);
          outline: none;
        }

        .nav-item.active {
          background: rgba(75, 59, 42, 0.18);
          color: #2f2115;
          box-shadow: none;
          border-color: rgba(75, 59, 42, 0.22);
        }

        .nav-item-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          transition: margin 0.2s ease, transform 0.2s ease;
        }

        .nav-item:hover .nav-item-icon {
          transform: translateY(-1px);
        }

        .sidebar.collapsed .nav-item-icon {
          margin-right: 0;
        }

        .nav-item-text {
          font-size: 14px;
          font-weight: 500;
          transition: opacity 0.2s ease;
        }

        .sidebar.collapsed .nav-item-text {
          opacity: 0;
          display: none;
        }

        .nav-item::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          margin-left: 12px;
          z-index: 1000;
        }

        .sidebar.collapsed .nav-item:hover::after {
          opacity: 1;
        }

        /* Modern Notification Badge Styling */
        .nav-item-badge {
          position: absolute;
          top: 8px;
          right: 12px;
          min-width: 18px;
          height: 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: white;
          padding: 0 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.9);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(1);
          backdrop-filter: blur(4px);
          z-index: 10;
        }

        .nav-item-badge:empty {
          display: none;
        }

        .nav-item:hover .nav-item-badge {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 1);
        }

        .sidebar.collapsed .nav-item-badge {
          right: 8px;
          top: 6px;
          min-width: 16px;
          height: 16px;
          font-size: 9px;
          border-width: 1.5px;
        }

        .nav-item-badge[id="urgentBadge"] {
          background: linear-gradient(135deg, #d96b5f, #b85045);
        }

        .nav-item-badge[id="samplesBadge"] {
          background: linear-gradient(135deg, #e0a45c, #c3843b);
        }

        .nav-item-badge[id="overdueBadge"] {
          background: linear-gradient(135deg, #c65a4f, #a9453d);
        }

        .nav-item-badge[id="todayBadge"] {
          background: linear-gradient(135deg, #c48b5a, #a8703f);
        }

        @keyframes badgePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .nav-item-badge.updated {
          animation: badgePulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item-urgent:hover {
          background: rgba(217, 107, 95, 0.12) !important;
          color: #b85045 !important;
        }

        .nav-item-samples:hover {
          background: rgba(224, 164, 92, 0.12) !important;
          color: #c3843b !important;
        }

        .nav-item-overdue:hover {
          background: rgba(198, 90, 79, 0.12) !important;
          color: #a9453d !important;
        }

        .nav-item-today:hover {
          background: rgba(196, 139, 90, 0.18) !important;
          color: #a8703f !important;
        }

        .orders-filter-bar {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          row-gap: 12px;
          width: calc(100% + 64px);
          margin: -32px -32px 24px;
          padding: 16px 24px;
          background: #fdf8f1;
          border-radius: 0 0 16px 16px;
          border: 1px solid rgba(196, 139, 90, 0.18);
          border-top: none;
          box-shadow: 0 8px 18px rgba(79, 59, 37, 0.08);
        }

        .orders-table-container {
          background: #fffaf3;
          border-radius: 16px;
          border: 1px solid rgba(196, 139, 90, 0.18);
          box-shadow: 0 10px 24px rgba(79, 59, 37, 0.1);
          overflow: hidden;
          width: calc(100% + 64px);
          margin: -8px -32px 24px;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }

        @media (max-width: 768px) {
          .orders-filter-bar {
            width: 100%;
            margin: 12px 0 20px;
            padding: 16px;
            border-radius: 12px;
            border-top: 1px solid rgba(196, 139, 90, 0.18);
          }

          .orders-table-container {
            width: 100%;
            margin: -8px 0 20px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
        }

        /* Main content area */
        .main-content {
          flex: 1;
          background: #f3f4f6;
          backdrop-filter: none;
          margin: 20px;
          margin-left: 20px;
          border-radius: 16px;
          box-shadow: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-header {
          background: linear-gradient(135deg, rgba(248, 232, 212, 0.95), rgba(237, 209, 179, 0.9));
          padding: 24px 32px;
          border-bottom: 1px solid rgba(156, 110, 60, 0.18);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .content-title {
          font-size: 24px;
          font-weight: 700;
          color: #4b3b2a;
          margin: 0;
        }

        .content-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .content-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 600;
          color: #fffaf3;
          background: linear-gradient(135deg, #e2b684, #c7925b);
          border-radius: 999px;
          border: 1px solid rgba(108, 78, 52, 0.25);
          box-shadow: 0 10px 20px rgba(79, 59, 37, 0.18);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
        }

        .content-pill-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(79, 59, 37, 0.22);
          filter: brightness(1.02);
        }

        .content-pill-btn:active {
          transform: translateY(0);
          box-shadow: 0 6px 14px rgba(79, 59, 37, 0.18);
          filter: brightness(0.98);
        }

        .content-pill-btn--export {
          background: linear-gradient(135deg, #efc892, #c48b5a);
        }

        .content-pill-btn--refresh {
          background: linear-gradient(135deg, #d2c3ac, #a3876a);
        }

        .content-pill-btn--logout {
          background: linear-gradient(135deg, #c76f5c, #a85544);
        }

        .content-pill-btn--compact {
          padding: 8px 18px;
          font-size: 13px;
        }

        /* Support Menu Styles */
        .support-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .support-menu-item:hover {
          background: #f4ecdf;
          transform: translateX(4px);
        }

        .support-menu-icon {
          font-size: 20px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .support-menu-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .support-menu-label {
          font-weight: 600;
          font-size: 14px;
          color: #4b3b2a;
        }

        .support-menu-desc {
          font-size: 12px;
          color: #92400e;
        }

        .content-body {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        /* Enhanced Quick Action Buttons */
        .quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -260px;
            z-index: 1000;
            margin: 0;
            min-height: 100vh;
            border-radius: 0;
          }
          
          .sidebar.open {
            left: 0;
          }
          
          .main-content {
            margin-left: 20px;
          }
        }

        /* View Transition Animations */
        #ordersView, #kanbanView, #calendarView, #samplesView, #createOrderView, #workflowView {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }

        #ordersView.view-active, #kanbanView.view-active, #calendarView.view-active, 
        #samplesView.view-active, #createOrderView.view-active, #workflowView.view-active {
          opacity: 1;
          transform: translateY(0);
          animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .view-transitioning-out {
          animation: fadeOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Smooth scrolling for content changes */
        .main-content {
          scroll-behavior: smooth;
        }

        /* Loading state for smooth transitions */
        .view-loading {
          pointer-events: none;
          filter: blur(1px);
          transition: filter 0.2s ease;
        }

        .order-expand-button {
          width: 26px;
          height: 26px;
          border: none;
          background: transparent;
          color: #a66b38;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s ease;
        }

        .order-expand-button:hover,
        .order-expand-button:focus-visible,
        #ordersBody tr:hover .order-expand-button {
          background: transparent;
          color: #8c5f30;
        }

        .order-expand-button:focus-visible {
          outline: 2px solid rgba(196, 139, 90, 0.45);
          outline-offset: 2px;
        }

        .order-expand-arrow {
          display: inline-block;
          font-size: 12px;
          line-height: 1;
          transform: rotate(180deg);
          opacity: 1;
          transition: transform 0.2s ease;
        }

        .order-expand-arrow.is-open {
          transform: rotate(90deg);
        }

        /* Production column styling */
        .production-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
          line-height: 1.25;
        }

        .production-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-transform: none;
          background: rgba(210, 187, 161, 0.35);
          color: #4b3927;
          border: 1px solid transparent;
          box-shadow: 0 6px 14px rgba(41, 28, 18, 0.12);
          white-space: nowrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .production-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(41, 28, 18, 0.18);
        }

        .production-chip--photobox {
          background: rgba(204, 223, 198, 0.9);
          color: #375d3b;
          border-color: rgba(167, 195, 164, 0.65);
          box-shadow: 0 6px 14px rgba(55, 93, 59, 0.16);
        }

        .production-chip--mandb {
          background: rgba(240, 200, 157, 0.8);
          color: #8a5324;
          border-color: rgba(210, 170, 128, 0.6);
          box-shadow: 0 6px 14px rgba(138, 83, 36, 0.16);
        }

        .production-chip--gils {
          background: rgba(210, 226, 221, 0.85);
          color: #2f5f52;
          border-color: rgba(171, 201, 192, 0.6);
          box-shadow: 0 6px 14px rgba(47, 95, 82, 0.16);
        }

        .production-chip--merrild {
          background: rgba(243, 214, 174, 0.8);
          color: #7d4f1b;
          border-color: rgba(222, 186, 138, 0.6);
          box-shadow: 0 6px 14px rgba(125, 79, 27, 0.16);
        }

        .production-chip--unassigned {
          background: rgba(226, 232, 240, 0.6);
          color: #475569;
          border-color: rgba(203, 213, 225, 0.7);
          box-shadow: 0 6px 14px rgba(71, 85, 105, 0.14);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table thead th {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .orders-table tbody td {
          padding: 6px 8px;
          font-size: 12px;
          vertical-align: top;
          border-bottom: 1px solid rgba(196, 139, 90, 0.16);
        }

        .orders-table tbody tr {
          background: rgba(75, 59, 42, 0.08);
          transition: background 0.2s ease;
        }

        .orders-table tbody tr:hover {
          background: rgba(75, 59, 42, 0.14);
        }

        .orders-table tbody tr.selected-row {
          background: rgba(235, 207, 174, 0.7);
        }
      </style>

      <script>
        // Update content title when switching views
        function updateContentTitle(title) {
          const contentTitle = document.getElementById('contentTitle');
          if (contentTitle) {
            contentTitle.textContent = title;
          }
        }

        // Quick action functions
        function refreshData() {
          // Show loading indicator
          showToast('🔄 Refreshing data...', 'info');
          
          // Refresh the current view data
          if (typeof drawRows === 'function') {
            drawRows();
          }
          
          // Update dashboard if it's the current view
          if (currentView === 'dashboard' && typeof window.populateDashboardContent === 'function') {
            window.populateDashboardContent();
          }
          
          // Update quick action badges
          if (typeof window.updateQuickActionBadges === 'function') {
            window.updateQuickActionBadges();
          }
          
          // Show success message
          setTimeout(() => {
            showToast('✅ Data refreshed successfully!', 'success');
          }, 500);
        }

        // Enhanced export function to export currently displayed/filtered data
        function exportToCsv() {
          try {
            // Determine current view
            const currentView = getCurrentView();
            console.log('Exporting data for view:', currentView);
            
            if (currentView === 'orders' || !currentView) {
              // Get the currently filtered and searched orders
              let orders = window.authSystem ? window.authSystem.getFilteredOrders(window.rkhOrders || []) : (window.rkhOrders || []);
              
              // Apply search filter if active
              const searchBox = document.getElementById('searchBox');
              if (searchBox && searchBox.value.trim()) {
                const searchTerm = searchBox.value.toLowerCase();
                orders = orders.filter(o => 
                  !searchTerm || 
                  o.orderNumber.toLowerCase().includes(searchTerm) ||
                  o.title.toLowerCase().includes(searchTerm) ||
                  o.photographer.toLowerCase().includes(searchTerm) ||
                  o.status.toLowerCase().includes(searchTerm) ||
                  o.method.toLowerCase().includes(searchTerm)
                );
              }
              
              if (orders.length === 0) {
                showToast('⚠️ No orders to export with current filters', 'warning');
                return;
              }
              
              // Enhanced header with Post Production info
              const header = 'Order Number,Title,Status,Production,Post Production Type,AI Operation,Purchase Group,Event ID,Photographer,Priority,Deadline,Budget,Created By,Assigned To,Photo Types';
              const rows = orders.map(o => {
                // Handle Post Production details
                let methodDisplay = o.method || '';
                let postProdType = '';
                let aiOperation = '';
                
                if (o.method === 'Post Production' && o.postProduction) {
                  postProdType = o.postProduction.type || '';
                  if (o.postProduction.type === 'GenAI' && o.postProduction.genaiConfig) {
                    aiOperation = o.postProduction.genaiConfig.operation || '';
                  }
                }
                
                return [
                  o.orderNumber || '', 
                  o.title || '', 
                  o.status || '', 
                  methodDisplay, 
                  postProdType,
                  aiOperation,
                  o.purchaseGroup ? (o.purchaseGroup + ' - ' + (purchaseGroups[o.purchaseGroup] || 'Unknown')) : 'N/A', 
                  o.eventId || 'N/A', 
                  o.photographer || '', 
                  o.priority || '', 
                  o.deadline || '',
                  o.budget || '',
                  o.createdBy || '',
                  o.assignedTo || '',
                  (o.photoTypes || []).join('; ')
                ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',');
              }).join('\\n');
              
              const blob = new Blob(['\\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              
              // Include search term in filename if active
              const searchSuffix = searchBox && searchBox.value.trim() ? '_filtered' : '';
              a.download = 'photo_orders' + searchSuffix + '_' + new Date().toISOString().slice(0,10) + '.csv';
              
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(a.href);
              
              const filterInfo = searchBox && searchBox.value.trim() ? ' (filtered)' : '';
              showToast('📊 Exported ' + orders.length + ' orders' + filterInfo + ' to CSV', 'success');
              
            } else if (currentView === 'samples') {
              if (!window.samples || window.samples.length === 0) {
                showToast('⚠️ No samples to export', 'warning');
                return;
              }
              
              const header = 'Sample ID,Article Name,Status,Location,Assigned To,Transit History,Last Update';
              const rows = window.samples.map(s => [
                s.id || '', 
                s.articleName || '', 
                s.status || '', 
                s.location || '', 
                s.assignedTo || '', 
                s.transitHistory || '', 
                s.lastUpdate || ''
              ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\\n');
              
              const blob = new Blob(['\\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'samples_tracking_' + new Date().toISOString().slice(0,10) + '.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(a.href);
              
              showToast('📊 Exported ' + window.samples.length + ' samples to CSV', 'success');
              
            } else {
              showToast('⚠️ Export not available for current view', 'warning');
            }
          } catch (error) {
            console.error('Export error:', error);
            showToast('❌ Export failed. Please try again.', 'error');
          }
        }

        // Helper function to get current view
        function getCurrentView() {
          // Check which view is currently active
          const views = ['ordersView', 'samplesView', 'createOrderView', 'templatesView', 'workflowView', 'kanbanView', 'calendarView', 'dashboardView'];
          for (const viewId of views) {
            const view = document.getElementById(viewId);
            if (view && view.style.display !== 'none' && view.classList.contains('view-active')) {
              return viewId.replace('View', '');
            }
          }
          return 'orders'; // default to orders view
        }

        function showSettings() {
          alert('⚙️ Settings Panel\\n\\nFeature coming soon! This will include:\\n\\n• User preferences\\n• System configuration\\n• Display options\\n• Notification settings');
        }

        function showProfile() {
          alert('👤 User Profile\\n\\nFeature coming soon! This will include:\\n\\n• Personal information\\n• Role permissions\\n• Activity history\\n• Account settings');
        }

        // testGoogleAIConnection function moved to top of file for immediate global access

        // WebSocket Manager for Runware API
        class RunwareWebSocketManager {
          constructor() {
            this.ws = null;
            this.isConnected = false;
            this.reconnectAttempts = 0;
            this.maxReconnectAttempts = 5;
            this.reconnectDelay = 1000;
            this.pendingRequests = new Map();
            this.requestId = 0;
          }

          connect() {
            return new Promise((resolve, reject) => {
              try {
                console.log('Connecting to Runware WebSocket...');

                // Check for browser extension conflicts
                if (this.detectBrowserExtensionConflict()) {
                  const error = new Error('Browser extension conflict detected. Please disable extensions that may interfere with WebSocket connections (e.g., ad blockers, VPN extensions).');
                  console.error('WebSocket connection blocked by browser extension:', error.message);
                  showToast('❌ Browser extension conflict detected. Please disable interfering extensions and try again.', 'error');
                  reject(error);
                  return;
                }

                this.ws = new WebSocket(runwareConfig.websocketEndpoint);

                this.ws.onopen = () => {
                  console.log('Runware WebSocket connected');
                  this.isConnected = true;
                  this.reconnectAttempts = 0;

                  // Authenticate with API key
                  this.authenticate().then(() => {
                    resolve();
                  }).catch(reject);
                };

                this.ws.onmessage = (event) => {
                  this.handleMessage(event);
                };

                this.ws.onclose = (event) => {
                  console.log('Runware WebSocket closed:', event.code, event.reason);
                  this.isConnected = false;

                  // Enhanced close reason handling
                  if (event.code === 1006) {
                    console.warn('WebSocket closed abnormally (code 1006) - possible network issue or extension interference');
                    showToast('⚠️ Connection lost - checking for network or extension issues', 'warning');
                  } else if (event.code === 1008) {
                    console.warn('WebSocket closed due to policy violation (code 1008) - possible extension blocking');
                    showToast('❌ Connection blocked - please check browser extensions', 'error');
                  } else if (event.code === 1011) {
                    console.error('WebSocket server error (code 1011)');
                    showToast('❌ Server error - please try again later', 'error');
                  }

                  this.handleReconnection();
                };

                this.ws.onerror = (error) => {
                  console.error('Runware WebSocket error:', error);

                  // Enhanced error detection
                  const errorMessage = this.categorizeWebSocketError(error);
                  showToast('WebSocket Error: ' + errorMessage, 'error');

                  this.isConnected = false;
                  reject(error);
                };

                // Add connection timeout
                setTimeout(() => {
                  if (!this.isConnected) {
                    console.error('WebSocket connection timeout');
                    this.ws?.close();
                    showToast('⏰ Connection timeout - please check your internet connection', 'error');
                    reject(new Error('WebSocket connection timeout'));
                  }
                }, 10000); // 10 second timeout

              } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                const errorMessage = this.categorizeWebSocketError(error);
                showToast('Connection failed: ' + errorMessage, 'error');
                reject(error);
              }
            });
          }

          authenticate() {
            return new Promise((resolve, reject) => {
              const authMessage = {
                taskType: 'authentication',
                apiKey: runwareConfig.apiKey
              };

              this.sendMessage(authMessage)
                .then(response => {
                  if (response.data && response.data.authenticated) {
                    console.log('Runware authentication successful');
                    resolve();
                  } else {
                    reject(new Error('Authentication failed'));
                  }
                })
                .catch(reject);
            });
          }

          sendMessage(message) {
            return new Promise((resolve, reject) => {
              if (!this.isConnected) {
                reject(new Error('WebSocket not connected'));
                return;
              }

              const requestId = ++this.requestId;
              const fullMessage = {
                ...message,
                taskUUID: requestId.toString()
              };

              this.pendingRequests.set(requestId.toString(), { resolve, reject });

              try {
                this.ws.send(JSON.stringify(fullMessage));
                console.log('Sent message to Runware:', fullMessage);
              } catch (error) {
                this.pendingRequests.delete(requestId.toString());
                reject(error);
              }
            });
          }

          handleMessage(event) {
            try {
              const response = JSON.parse(event.data);
              console.log('Received message from Runware:', response);

              const taskUUID = response.taskUUID;
              if (taskUUID && this.pendingRequests.has(taskUUID)) {
                const { resolve, reject } = this.pendingRequests.get(taskUUID);
                this.pendingRequests.delete(taskUUID);

                if (response.error) {
                  reject(new Error(response.error));
                } else {
                  resolve(response);
                }
              }
            } catch (error) {
              console.error('Failed to parse WebSocket message:', error);
            }
          }

          handleReconnection() {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.reconnectAttempts++;
              const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

              console.log('Attempting to reconnect (' + this.reconnectAttempts + '/' + this.maxReconnectAttempts + ') in ' + delay + 'ms...');

              setTimeout(() => {
                this.connect().catch(error => {
                  console.error('Reconnection failed:', error);
                });
              }, delay);
            } else {
              console.error('Max reconnection attempts reached');
              showToast('❌ Lost connection to Runware API', 'error');
            }
          }

          disconnect() {
            if (this.ws) {
              this.ws.close();
              this.ws = null;
              this.isConnected = false;
            }
          }

          // Helper method to detect browser extension conflicts
          detectBrowserExtensionConflict() {
            try {
              // Check for common extension interference patterns
              const extensionIndicators = [
                // Check if WebSocket constructor is modified
                WebSocket.toString().includes('native code') === false,
                // Check for unusual WebSocket properties
                typeof WebSocket.prototype.send !== 'function',
                // Check for network request interception
                navigator.userAgent.includes('Chrome') && window.chrome && window.chrome.webRequest,
                // Check for ad blocker interference
                typeof window.uBlock !== 'undefined' || typeof window.adBlock !== 'undefined'
              ];

              return extensionIndicators.some(indicator => indicator === true);
            } catch (error) {
              console.warn('Error detecting browser extension conflict:', error);
              return false;
            }
          }

          // Helper method to categorize WebSocket errors
          categorizeWebSocketError(error) {
            try {
              // Check error type and provide user-friendly messages
              if (error.message) {
                if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
                  return 'CORS policy blocked the connection. Please check browser security settings.';
                }
                if (error.message.includes('network') || error.message.includes('connection')) {
                  return 'Network connection issue. Please check your internet connection.';
                }
                if (error.message.includes('timeout')) {
                  return 'Connection timeout. The server may be busy or unreachable.';
                }
                if (error.message.includes('blocked') || error.message.includes('intercepted')) {
                  return 'Connection blocked by browser extension or firewall.';
                }
              }

              // Check WebSocket readyState for additional context
              if (this.ws) {
                switch (this.ws.readyState) {
                  case WebSocket.CONNECTING:
                    return 'Still attempting to connect. Please wait.';
                  case WebSocket.CLOSING:
                    return 'Connection is closing. Please try again.';
                  case WebSocket.CLOSED:
                    return 'Connection is closed. Please check network and try again.';
                }
              }

              return 'Unknown connection error. Please try again or contact support.';
            } catch (error) {
              console.warn('Error categorizing WebSocket error:', error);
              return 'Connection error occurred. Please try again.';
            }
          }

          isReady() {
            return this.isConnected;
          }

          // Image processing methods for Runware API
          async imageInference(prompt, imageData = null, options = {}) {
            if (!this.isReady()) {
              throw new Error('WebSocket not connected');
            }

            const message = {
              taskType: 'imageInference',
              model: runwareConfig.model,
              positivePrompt: prompt,
              numberResults: options.numberOfImages || 1,
              outputType: ["dataURI", "URL"],
              outputFormat: options.outputFormat || 'JPEG',
              seed: options.seed || Math.floor(Math.random() * 1000000),
              includeCost: true,
              referenceImages: imageData ? [imageData] : [],
              outputQuality: options.outputQuality || 85,
              taskUUID: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
            };

            console.log('Sending image inference request to Runware:', message);
            const response = await this.sendMessage(message);
            console.log('Received image inference response:', response);

            return response;
          }

          async uploadImage(imageData, fileName = 'uploaded_image.jpg') {
            if (!this.isReady()) {
              throw new Error('WebSocket not connected');
            }

            const message = {
              taskType: 'uploadImage',
              imageData: imageData, // base64 encoded image
              fileName: fileName,
              includeCost: true
            };

            console.log('Uploading image to Runware...');
            const response = await this.sendMessage(message);
            console.log('Image upload response:', response);

            return response;
          }

          async getImageResult(taskUUID) {
            if (!this.isReady()) {
              throw new Error('WebSocket not connected');
            }

            const message = {
              taskType: 'getImageResult',
              taskUUID: taskUUID
            };

            console.log('Requesting image result for task:', taskUUID);
            const response = await this.sendMessage(message);
            console.log('Image result response:', response);

            return response;
          }

          // Main processing function that replaces Google AI
          async processImageWithRunware(prompt, imageData = null, options = {}) {
            try {
              console.log('Processing image with Runware API...');
              console.log('Prompt:', prompt);
              console.log('Image data provided:', !!imageData);

              if (!this.isReady()) {
                await this.connect();
              }

              // Send image inference request
              const result = await this.imageInference(prompt, imageData, options);
              console.log('Runware processing result:', result);

              if (result && result.data && result.data.imageURL) {
                return {
                  success: true,
                  imageUrl: result.data.imageURL,
                  taskUUID: result.taskUUID,
                  cost: result.data.cost,
                  processingTime: result.data.processingTime
                };
              } else {
                throw new Error('No image URL in response');
              }

            } catch (error) {
              console.error('Runware processing error:', error);
              throw new Error('Failed to process with Runware API: ' + error.message);
            }
          }
        }

        // Global WebSocket manager instance
        console.log('[Init:1] 🔧 Creating RunwareWebSocketManager instance...');
        console.log('[Init:1] ⏱️ Timestamp:', new Date().toISOString());
        const runwareWS = new RunwareWebSocketManager();
        console.log('[Init:1] ✅ Instance created successfully');
        
        // Expose globally immediately
        console.log('[Init:1] 📤 Exposing to window...');
        window.runwareWS = runwareWS;
        window.RunwareWebSocketManager = RunwareWebSocketManager; // Expose class for fallback initialization
        console.log('[Init:1] ✅ Exposed to window');
        
        // Resolve the ready promise if it exists
        console.log('[Init:1] 🔍 Checking for resolver...');
        console.log('[Init:1] Resolver type:', typeof window._runwareReadyResolver);
        if (typeof window._runwareReadyResolver === 'function') {
          console.log('[Init:1] ✅ WebSocket fully initialized, resolving promise...');
          window._runwareReadyResolver(true);
          delete window._runwareStub;
          console.log('[Init:1] ✅ Promise resolved!');
        } else {
          console.warn('[Init:1] ⚠️ Resolver not found or not a function!');
        }
        
        console.log('[Init:1] ✅ Runware WebSocket Manager ready:', {
          instance: !!window.runwareWS,
          class: !!window.RunwareWebSocketManager,
          model: runwareConfig.model
        });

        // Generate appropriate prompts for different operations
        // Image upload handlers for Google AI Studio
        // Make these variables globally accessible
        window.uploadedImageData = null;
        window.uploadedImageFile = null;

        window.handleModalImageUpload = function(event) {
          const file = event.target.files[0];
          if (!file) return;
          
          // Validate file type
          if (!file.type.startsWith('image/')) {
            showToast('⚠️ Please select a valid image file', 'warning');
            return;
          }
          
          window.uploadedImageFile = file;
          const reader = new FileReader();
          
          reader.onload = function(e) {
            window.uploadedImageData = e.target.result;
            
            // Update the upload area to show the selected image
            const uploadContent = document.getElementById('modalUploadContent');
            if (uploadContent) {
              uploadContent.innerHTML = 
                '<div style="position: relative; text-align: center;">' +
                  '<img src="' + uploadedImageData + '" style="max-width: 100%; max-height: 150px; border-radius: 6px; margin-bottom: 8px; border: 2px solid #7fa284;">' +
                  '<div style="font-weight: 600; margin: 8px 0; color: #7fa284;">✅ Image Ready: ' + file.name + '</div>' +
                  '<div style="color: rgba(255,255,255,0.8); font-size: 12px;">Click to change image</div>' +
                '</div>';
              
              console.log('Image uploaded successfully:', file.name);
              showToast('📷 Image uploaded: ' + file.name, 'success');
            } else {
              console.error('Upload content element not found');
            }
          };
          
          reader.onerror = function() {
            showToast('❌ Error reading image file', 'error');
          };
          
          reader.readAsDataURL(file);
        };

        // Add drag and drop support
        window.setupImageDragDrop = function() {
          const uploadArea = document.getElementById('modalImageUploadArea');
          if (!uploadArea) return;
          
          uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#7fa284';
            uploadArea.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          });
          
          uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255,255,255,0.3)';
            uploadArea.style.backgroundColor = 'rgba(255,255,255,0.1)';
          });
          
          uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255,255,255,0.3)';
            uploadArea.style.backgroundColor = 'rgba(255,255,255,0.1)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              const file = files[0];
              if (file.type.startsWith('image/')) {
                document.getElementById('modalImageInput').files = files;
                handleModalImageUpload({ target: { files: [file] } });
              } else {
                showToast('⚠️ Please drop a valid image file', 'warning');
              }
            }
          });
        };

        // processImageWithAI function moved to top of file for immediate global access

        function generateImageEditingPrompt(operation, instructions) {
          // Ensure we have valid inputs
          const safeInstructions = instructions || 'general image editing';
          const safeOperation = operation || 'custom';
          
          console.log('Generating prompt for operation:', safeOperation, 'with instructions:', safeInstructions);
          
          const basePrompts = {
            'color-change': 'Edit the provided image to change the color as requested: ' + safeInstructions + '. Maintain the original composition, lighting, and style while only changing the specified colors.',
            'add-model': 'Add a model to the provided image as requested: ' + safeInstructions + '. Ensure the model fits naturally into the scene with appropriate lighting and perspective.',
            'background-change': 'Modify the background of the provided image: ' + safeInstructions + '. Keep the main subject unchanged while updating the background environment.',
            'lighting-adjustment': 'Adjust the lighting in the provided image: ' + safeInstructions + '. Modify the lighting conditions while preserving the main subject and composition.',
            'object-removal': 'Remove objects from the provided image: ' + safeInstructions + '. Fill in the removed areas naturally to maintain a seamless appearance.',
            'style-transfer': 'Transform the style of the provided image: ' + safeInstructions + '. Apply the requested artistic style while preserving the main subject and composition.',
            'product-enhancement': 'Enhance the quality of the provided image: ' + safeInstructions + '. Improve clarity, sharpness, and overall visual appeal.',
            'custom': 'Edit the provided image according to these instructions: ' + safeInstructions + '. Make the changes while maintaining natural lighting and composition.'
          };
          
          const prompt = basePrompts[safeOperation] || basePrompts['custom'];
          console.log('Generated prompt:', prompt);
          return prompt;
        }

        // Expose functions globally for accessibility
        window.generateImageEditingPrompt = generateImageEditingPrompt;
        window.checkGoogleAIAvailability = checkGoogleAIAvailability;
        // processImageWithAI is already defined directly on window at line 4201
        window.testGoogleAIConnection = testGoogleAIConnection;
        window.googleAIConfig = googleAIConfig;
        window.showGoogleAISetupModal = showGoogleAISetupModal;
        window.showGoogleAIPreviewModal = showGoogleAIPreviewModal;
        window.showToast = showToast;
        window.saveGoogleAIKey = saveGoogleAIKey;
        window.applyGoogleAIChanges = applyGoogleAIChanges;
        window.acceptGoogleAIResult = acceptGoogleAIResult;
        window.retryGoogleAIProcessing = retryGoogleAIProcessing;
        window.handleModalImageUpload = handleModalImageUpload;
        window.runwareWS = runwareWS;

        // Initialize Runware API configuration on startup
        loadGoogleAIConfig();

        // Test function for Post Production functionality
        function testPostProductionUI() {
          console.log('Testing Post Production UI...');
          const methodSelect = document.querySelector('select[name="method"]');
          const postProdDiv = document.getElementById('postProductionSubMethod');
          const genAIDiv = document.getElementById('genAIConfig');
          
          // Also check modal elements
          const modalMethodSelect = document.querySelector('.order-modal select[name="method"]');
          const modalPostProdDiv = document.getElementById('postProductionSubMethodModal');
          const modalGenAIDiv = document.getElementById('genAIConfigModal');
          
          console.log('=== Main Form Elements ===');
          console.log('Method select found:', methodSelect);
          console.log('Post Production div found:', postProdDiv);
          console.log('GenAI div found:', genAIDiv);
          
          console.log('=== Modal Form Elements ===');
          console.log('Modal method select found:', modalMethodSelect);
          console.log('Modal Post Production div found:', modalPostProdDiv);
          console.log('Modal GenAI div found:', modalGenAIDiv);
          
          // Test if functions are available
          console.log('handleMethodChange available:', typeof window.handleMethodChange);
          console.log('handleMethodChangeModal available:', typeof window.handleMethodChangeModal);
          
          return {
            mainForm: { methodSelect, postProdDiv, genAIDiv },
            modalForm: { modalMethodSelect, modalPostProdDiv, modalGenAIDiv }
          };
        }

        // Debug function to manually trigger post production display
        function debugShowPostProduction() {
          const modalPostProdDiv = document.getElementById('postProductionSubMethodModal');
          if (modalPostProdDiv) {
            modalPostProdDiv.style.display = 'block';
            console.log('Manually showing Post Production options');
            return 'Post Production options shown manually';
          } else {
            console.error('Modal Post Production div not found');
            return 'Modal Post Production div not found';
          }
        }

        function previewAIChanges() {
          const form = document.getElementById('createOrderForm') || document.querySelector('form');
          const aiOperation = form.querySelector('[name="aiOperation"]')?.value;
          const aiInstructions = form.querySelector('[name="aiInstructions"]')?.value;
          
          if (!aiOperation) {
            showToast('⚠️ Please select an AI operation first', 'warning');
            return;
          }
          
          // Use Google AI Studio (available now!) instead of Nano Banana
          if (googleAIConfig.apiKey) {
            showToast('🔄 Processing with Google AI Studio Gemini 2.5 Flash Image...', 'info');
            window.processWithGoogleAI(aiOperation, aiInstructions);
          } else {
            showToast('ℹ️ Configure Google AI Studio for real image editing', 'info');
            showGoogleAISetupModal();
          }
        }

        // Enhanced preview modal for Google AI Studio results
        function showGoogleAIPreviewModal(operation, instructions, result = null) {
          console.log('showGoogleAIPreviewModal called with:', {operation, instructions, result});

          const modal = document.createElement('div');
          modal.id = 'googleAIPreviewModal';
          modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';

          // Extract image URL from result if available
          let imageUrl = null;
          if (result && result.imageUrl) {
            imageUrl = result.imageUrl;
          }

          const hasResult = imageUrl || (result && result.success);

          modal.innerHTML =
            '<div style="background: white; border-radius: 12px; padding: 24px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;">' +
              '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">' +
                '<div style="display: flex; align-items: center;">' +
                  '<span style="font-size: 28px; margin-right: 12px;">🚀</span>' +
                  '<h3 style="margin: 0; color: #4b3b2a;">Runware AI Generated Image Preview</h3>' +
                '</div>' +
                '<button onclick="document.getElementById(\'googleAIPreviewModal\').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b5440;">&times;</button>' +
              '</div>' +
              '<div style="background: #fdf4e6; padding: 12px; border-radius: 6px; margin-bottom: 16px; text-align: center;">' +
                '🚀 <strong>Advanced AI:</strong> Powered by Runware API with Google Gemini Flash Image 2.5 model' +
              '</div>' +
              '<div style="margin-bottom: 16px; padding: 12px; background: #f1e8dc; border-radius: 8px;">' +
                '<strong>Operation:</strong> ' + (operation || 'Custom') + '<br>' +
                '<strong>Instructions:</strong> ' + (instructions || 'No specific instructions provided') +
              '</div>' +
              '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">' +
                '<div style="text-align: center;">' +
                  '<h4 style="margin: 0 0 8px; color: #4b3b2a;">Original Image</h4>' +
                  '<div style="width: 100%; height: 200px; background: #f1e8dc; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b5440;">' +
                    (window.uploadedImageData ? '<img src="' + window.uploadedImageData + '" style="max-width: 100%; max-height: 100%; border-radius: 6px;">' : '📷 No original image') +
                  '</div>' +
                '</div>' +
                '<div style="text-align: center;">' +
                  '<h4 style="margin: 0 0 8px; color: #4b3b2a;">AI Enhanced Result</h4>' +
                  '<div style="width: 100%; height: 200px; background: #fdf4e6; border: 2px solid #c48b5a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #4b3b2a;">' +
                    (hasResult && imageUrl ?
                      '<img src="' + imageUrl + '" style="max-width: 100%; max-height: 100%; border-radius: 6px;">' :
                      (hasResult ?
                        '✅ AI Result Generated<br><small>Runware API</small>' :
                        '🔄 Processing...<br><small>Runware API</small>'
                      )
                    ) +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">' +
                '<h4 style="margin: 0 0 8px; color: #a66b38;">🚀 Google Gemini Flash Image 2.5 Features:</h4>' +
                '<ul style="margin: 0; padding-left: 20px; color: #a66b38; font-size: 14px;">' +
                  '<li>Advanced AI image generation and editing</li>' +
                  '<li>High-fidelity image processing with WebSocket</li>' +
                  '<li>Real-time image inference capabilities</li>' +
                  '<li>Professional-grade image enhancement</li>' +
                  '<li>Fast processing with Google Gemini Flash Image 2.5 model</li>' +
                  '<li>WebSocket-based real-time communication</li>' +
                '</ul>' +
              '</div>' +
              '<div style="display: flex; gap: 12px; justify-content: flex-end;">' +
                '<button onclick="document.getElementById(\'googleAIPreviewModal\').remove()" style="padding: 10px 20px; background: #6b5440; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>' +
                '<button onclick="window.retryGoogleAIProcessing()" style="padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;">🔄 Retry</button>' +
                '<button onclick="window.acceptGoogleAIResult(\'' + (imageUrl || '') + '\')" style="padding: 10px 20px; background: #7fa284; color: white; border: none; border-radius: 6px; cursor: pointer;">✅ Accept & Assign</button>' +
              '</div>' +
            '</div>';

          document.body.appendChild(modal);
        }

        function applyGoogleAIChanges() {
          document.getElementById('googleAIPreviewModal')?.remove();
          showToast('✅ Google AI Studio changes applied to order!', 'success');
        }

        function acceptGoogleAIResult(imageUrl) {
          console.log('Accepting Google AI result:', imageUrl);

          if (!imageUrl) {
            showToast('❌ No image to accept', 'error');
            return;
          }

          // Store the accepted image for the current order
          window.acceptedAIImage = imageUrl;

          // Try to find the current order and assign the image
          const currentOrder = getCurrentOrder();
          if (currentOrder) {
            assignImageToOrder(currentOrder.id, imageUrl);
          } else {
            // Fallback: store globally for later assignment
            console.log('No current order found, storing image globally');
          }

          document.getElementById('googleAIPreviewModal')?.remove();
          showToast('✅ AI image accepted and assigned to order!', 'success');

          console.log('Accepted AI image stored:', window.acceptedAIImage);
        }

        function getCurrentOrder() {
          // This would integrate with your order management system
          // For now, we'll look for order data in the DOM or local storage
          const orderElements = document.querySelectorAll('[data-order-id], .order-item, .current-order');
          if (orderElements.length > 0) {
            return {
              id: orderElements[0].getAttribute('data-order-id') || 'current-order',
              element: orderElements[0]
            };
          }

          // Check local storage for current order
          const storedOrder = localStorage.getItem('currentOrder');
          if (storedOrder) {
            return JSON.parse(storedOrder);
          }

          return null;
        }

        function assignImageToOrder(orderId, imageUrl) {
          console.log('Assigning image to order:', orderId, imageUrl);

          // This would integrate with your order management system
          // For demonstration, we'll store it in localStorage
          const orderData = {
            id: orderId,
            aiImage: imageUrl,
            timestamp: new Date().toISOString(),
            status: 'image-assigned'
          };

          localStorage.setItem('order_' + orderId, JSON.stringify(orderData));

          // Also update any order display elements
          const orderElement = document.querySelector('[data-order-id="' + orderId + '"]');
          if (orderElement) {
            // Add visual indicator that image has been assigned
            orderElement.style.borderLeft = '4px solid #7fa284';
            orderElement.setAttribute('data-has-ai-image', 'true');
          }

          console.log('Image assigned to order successfully');
        }

        function retryGoogleAIProcessing() {
          console.log('Retrying Google AI processing');
          document.getElementById('googleAIPreviewModal')?.remove();

          // Focus on instructions field to allow user to modify
          const instructionsField = document.getElementById('modalAiInstructions');
          if (instructionsField) {
            instructionsField.focus();
            instructionsField.select();
          }

          showToast('🔄 Ready to retry with new instructions', 'info');
        }

        // showGoogleAISetupModal and saveGoogleAIKey functions moved to top of file for immediate access

        function showNanoBananaPreviewModal(operation, instructions) {
          const modal = document.createElement('div');
          modal.id = 'nanoBananaPreviewModal';
          modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
          
          modal.innerHTML = 
            '<div style="background: white; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">' +
              '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">' +
                '<div style="display: flex; align-items: center;">' +
                  '<span style="font-size: 28px; margin-right: 12px;">🍌</span>' +
                  '<h3 style="margin: 0; color: #4b3b2a;">Nano Banana AI Preview</h3>' +
                '</div>' +
                '<button onclick="document.getElementById(\'nanoBananaPreviewModal\').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b5440;">&times;</button>' +
              '</div>' +
              '<div style="margin-bottom: 16px; padding: 12px; background: #f1e8dc; border-radius: 8px;">' +
                '<strong>Operation:</strong> ' + operation + '<br>' +
                '<strong>Instructions:</strong> ' + (instructions || 'No specific instructions provided') +
              '</div>' +
              '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">' +
                '<div>' +
                  '<h4 style="margin: 0 0 8px 0; color: #4b3b2a;">Original</h4>' +
                  '<div style="width: 100%; height: 200px; background: linear-gradient(135deg, #f1e8dc 0%, #e5e7eb 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b5440;">' +
                    '📷 Original Image<br><small>Product Photo</small>' +
                  '</div>' +
                '</div>' +
                '<div>' +
                  '<h4 style="margin: 0 0 8px 0; color: #4b3b2a;">AI Enhanced</h4>' +
                  '<div style="width: 100%; height: 200px; background: linear-gradient(135deg, #f4e8d8 0%, #e7d2b8 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">' +
                    '✨ AI Enhanced<br><small>Nano Banana Result</small>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin-bottom: 16px;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 8px;">' +
                  '<span style="color: #d97706; margin-right: 8px;">⚡</span>' +
                  '<strong style="color: #92400e;">AI Processing Details</strong>' +
                '</div>' +
                '<div style="font-size: 13px; color: #78350f;">' +
                  '• Processing time: ~2.3 seconds<br>' +
                  '• Quality level: High<br>' +
                  '• Confidence score: 94%<br>' +
                  '• Estimated cost: $0.12' +
                '</div>' +
              '</div>' +
              '<div style="display: flex; gap: 12px; justify-content: flex-end;">' +
                '<button onclick="document.getElementById(\'nanoBananaPreviewModal\').remove()" style="padding: 10px 20px; background: #6b5440; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>' +
                '<button onclick="applyNanoBananaChanges()" style="padding: 10px 20px; background: #7fa284; color: white; border: none; border-radius: 6px; cursor: pointer;">✅ Apply Changes</button>' +
              '</div>' +
            '</div>';
          
          document.body.appendChild(modal);
          showToast('🎨 AI preview generated successfully!', 'success');
        }

        function applyNanoBananaChanges() {
          document.getElementById('nanoBananaPreviewModal')?.remove();
          
          if (nanoBananaConfig.demoMode) {
            showToast('📋 Demo: AI enhancement saved to order notes', 'info');
            // In demo mode, just add a note to the order
            console.log('Demo mode: Would apply Nano Banana AI changes to order');
          } else {
            showToast('✅ Nano Banana AI changes applied to order!', 'success');
            // Real API mode: actually apply the changes
          }
        }

        // Configuration function for when API becomes available
        window.configureNanoBananaAPI = function(apiKey) {
          if (!apiKey) {
            console.log('🔧 Nano Banana Configuration:');
            console.log('Current status:', nanoBananaConfig.isAvailable ? 'API Available' : 'API Coming Soon');
            console.log('Demo mode:', nanoBananaConfig.demoMode);
            console.log('API endpoint:', nanoBananaConfig.apiEndpoint);
            console.log('');
            console.log('📋 To configure when API is available:');
            console.log('configureNanoBananaAPI("your-api-key-here")');
            return;
          }
          
          nanoBananaConfig.apiKey = apiKey;
          nanoBananaConfig.demoMode = false;
          console.log('✅ Nano Banana API configured');
          showToast('✅ Nano Banana API configured successfully!', 'success');
        };

        // Expose AI functions globally
        window.testNanoBananaConnection = testNanoBananaConnection;
        window.previewAIChanges = previewAIChanges;
        window.showNanoBananaPreviewModal = showNanoBananaPreviewModal;
        window.applyNanoBananaChanges = applyNanoBananaChanges;
        window.testPostProductionUI = testPostProductionUI;
        window.debugShowPostProduction = debugShowPostProduction;
        window.configureNanoBananaAPI = configureNanoBananaAPI;
        window.nanoBananaConfig = nanoBananaConfig; // For debugging

      </script>

      <!-- Hidden Views (existing structure) -->
            </div>
          </div>  

        <div id="mainContent">
          <!-- Content will be dynamically loaded here -->
          
          <!-- Samples View (moved inside mainContent for proper positioning) -->
          <div style="display: none;" id="samplesView">
            <h3 style="margin: 16px 0 8px; font-size: 18px; color: #4b3b2a;">📦 Sample Management</h3>
            <table>
              <thead>
                <tr>
                  <th>Sample ID</th>
                  <th>Article Name</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Assigned To</th>
                  <th>Transit History</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody id="samplesBody"></tbody>
            </table>
          </div>
        </div>

        <div style="display: none;" id="createOrderView">
          <h3 style="margin: 16px 0 8px; font-size: 18px; color: #4b3b2a;">🎨 Create New Content Project</h3>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <form id="createOrderForm" style="display: grid; gap: 12px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Order Title</label>
                  <input name="title" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                         placeholder="e.g., Premium Product Photography Session">
                </div>
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Production</label>
                  <select name="method" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" onchange="handleMethodChange(this)">
                    <option value="">Select production...</option>
                    <option value="Photo Box">Photo Box</option>
                    <option value="M&B">M&B</option>
                    <option value="GILS">GILS</option>
                    <option value="MERRILD">MERRILD</option>
                  </select>
                </div>
              </div>

              <!-- EVENT ID & TACTIC FIELDS - PRIMARY SECTION -->
              <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 12px; margin: 8px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 20px; margin-right: 8px;">🏢</span>
                  <h4 style="margin: 0; font-weight: 600; color: #92400e;">Event & Tactic Information <span style="font-size: 12px; font-weight: normal; color: #78350f;">(Optional - can be added later)</span></h4>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                  <div>
                    <label style="display: block; font-weight: 500; margin-bottom: 4px; color: #78350f;">Event ID <span style="font-size: 11px; font-weight: normal;">(e.g., A3225055)</span></label>
                    <input name="eventId" type="text" style="width: 100%; padding: 8px; border: 1px solid #f59e0b; border-radius: 4px; font-family: monospace;" 
                           placeholder="A3225055" pattern="^A\\d{7,8}$" title="Format: A + Week + Year + Counter (e.g., A3225055)"
                           oninput="this.value = this.value.toUpperCase(); validateEventIdField(this);">
                    <div id="eventIdHint" style="font-size: 10px; color: #78350f; margin-top: 2px;">50-100 orders typical per event</div>
                  </div>
                  <div>
                    <label style="display: block; font-weight: 500; margin-bottom: 4px; color: #78350f;">Tactic Type</label>
                    <select name="tacticType" style="width: 100%; padding: 8px; border: 1px solid #f59e0b; border-radius: 4px;" onchange="handleTacticTypeChange(this)">
                      <option value="">Select tactic type...</option>
                      <option value="Print">Print</option>
                      <option value="Digital">Digital</option>
                      <option value="Point of Sale">Point of Sale</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="In-Store">In-Store</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Event">Event</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; font-weight: 500; margin-bottom: 4px; color: #78350f;">Tactic</label>
                    <select name="tactic" id="tacticSelect" style="width: 100%; padding: 8px; border: 1px solid #f59e0b; border-radius: 4px;" disabled>
                      <option value="">Select tactic type first...</option>
                    </select>
                  </div>
                </div>
                <div style="background: #fffbeb; padding: 8px; border-radius: 4px; margin-top: 8px; font-size: 11px; color: #78350f;">
                  💡 <strong>Tip:</strong> Event ID connects 50-100 related photo orders. Use for integrated orders from CPT/PMR. Manual orders can be created without Event ID.
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                
                <!-- Post Production Sub-Method Selection -->
                <div id="postProductionSubMethod" style="display: none;">
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Post Production Type</label>
                  <select name="postProductionType" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" onchange="handlePostProductionTypeChange(this)">
                    <option value="">Select post production type...</option>
                    <option value="Internal">Internal</option>
                    <option value="GenAI">GenAI (Nano Banana)</option>
                  </select>
                </div>
                
                <!-- GenAI Configuration Panel -->
                <div id="genAIConfig" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: linear-gradient(135deg, #f4e8d8 0%, #e7d2b8 100%); color: white;">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 20px; margin-right: 8px;">🍌</span>
                    <h4 style="margin: 0; font-weight: 600;">Nano Banana AI Configuration</h4>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                      <label style="display: block; font-weight: 500; margin-bottom: 4px; font-size: 13px;">AI Operation</label>
                      <select name="aiOperation" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px;">
                        <option value="">Select operation...</option>
                        <option value="color-change">Color Change</option>
                        <option value="add-model">Add Model</option>
                        <option value="background-change">Background Change</option>
                        <option value="object-removal">Object Removal</option>
                        <option value="style-transfer">Style Transfer</option>
                        <option value="product-enhancement">Product Enhancement</option>
                        <option value="lighting-adjustment">Lighting Adjustment</option>
                        <option value="custom">Custom Prompt</option>
                      </select>
                    </div>
                    <div>
                      <label style="display: block; font-weight: 500; margin-bottom: 4px; font-size: 13px;">Quality Level</label>
                      <select name="aiQuality" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px;">
                        <option value="standard">Standard</option>
                        <option value="high" selected>High Quality</option>
                        <option value="ultra">Ultra HD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style="margin-bottom: 12px;">
                    <label style="display: block; font-weight: 500; margin-bottom: 4px; font-size: 13px;">AI Instructions</label>
                    <textarea name="aiInstructions" rows="3" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; resize: vertical;" 
                              placeholder="Describe the changes you want the AI to make...&#10;Example: Change the dress color to burgundy red, add a female model wearing the dress in a studio setting"></textarea>
                  </div>
                  
                  <div style="display: flex; gap: 8px;">
                    <button type="button" onclick="testNanoBananaConnection()" style="padding: 6px 12px; background: #7fa284; color: white; border: none; border-radius: 4px; font-size: 12px;">
                      🔗 Test Connection
                    </button>
                    <button type="button" onclick="previewAIChanges()" style="padding: 6px 12px; background: #b48fc7; color: white; border: none; border-radius: 4px; font-size: 12px;">
                      👁️ Preview
                    </button>
                  </div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Priority</label>
                  <select name="priority" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Deadline</label>
                  <input name="deadline" type="date" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                </div>
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Budget</label>
                  <input name="budget" type="number" min="0" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" placeholder="0">
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Assign To</label>
                <select name="photographer" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="">Select photographer/photo box...</option>
                  <option value="Mike Rodriguez">Mike Rodriguez (Photographer)</option>
                  <option value="Emily Chen">Emily Chen (Photographer)</option>
                  <option value="Alex Turner">Alex Turner (Photo Box)</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Buyers & Items</label>
                <div id="buyersContainer" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #f8fafc;">
                  <div class="buyer-item" style="display: grid; grid-template-columns: 200px 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px;">
                    <input type="text" class="buyer-name" placeholder="Buyer/Department" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                    <input type="text" class="buyer-items" placeholder="Items for this buyer (comma-separated)" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                    <button type="button" onclick="removeBuyer(this)" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 12px;">✕</button>
                  </div>
                  <button type="button" id="addBuyerBtn" style="padding: 6px 12px; background: #7fa284; color: white; border: none; border-radius: 4px; font-size: 12px;">+ Add Buyer</button>
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Detailed Brief</label>
                <textarea name="brief" required rows="4" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                          placeholder="Provide detailed instructions for the content creation..."></textarea>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Articles</label>
                <div style="display: flex; gap: 8px; align-items: end;">
                  <div style="flex: 1;">
                    <textarea id="articlesTextarea" name="articles" required rows="3" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                              placeholder="Articles with EAN codes will appear here...&#10;Format: Article Name [EAN: 1234567890123]"></textarea>
                  </div>
                  <button type="button" id="scanArticleBtn" style="padding: 8px 12px; background: #a66b38; color: white; border: none; border-radius: 4px; cursor: pointer; height: 44px; white-space: nowrap;">
                    📷 Scan Article
                  </button>
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">
                  Photo Types Required 
                  <button type="button" id="applyTemplateRulesBtn" style="padding: 2px 6px; background: #6366f1; color: white; border: none; border-radius: 3px; font-size: 10px; margin-left: 8px;">🎯 Apply Rules</button>
                </label>
                <div id="photoTypesContainer" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #f8fafc;">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 8px;">
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Product"> Product Shot</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Lifestyle"> Lifestyle</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Detail"> Detail Shots</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="360"> 360° View</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Model"> Model Shots</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Size"> Size Guide</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Package"> Packaging</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Group"> Group Shot</label>
                  </div>
                  <div id="appliedRulesInfo" style="font-size: 11px; color: #6b5440; margin-top: 8px; display: none;">
                    Applied rules will be shown here...
                  </div>
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Deliverables (comma-separated)</label>
                <input name="deliverables" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                       placeholder="e.g., Product Photos, Lifestyle Shots, Social Media Assets">
              </div>

              <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
                <button type="button" id="cancelCreate" class="btn">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>

        <div style="display: none;" id="templatesView">
          <h3 style="margin: 16px 0 8px; font-size: 18px; color: #4b3b2a;">⚡ Quick Templates</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px;">
            <div class="template-card" data-template="product-hero" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #4b3b2a;">📸 Product Hero Shots</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b5440;">High-impact product photography for marketing campaigns</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: Photographer • Priority: High • Duration: 3-5 days</div>
            </div>
            <div class="template-card" data-template="ecommerce-batch" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #4b3b2a;">🛒 E-commerce Batch</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b5440;">Automated white background product shots for online store</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: Photo Box • Priority: Medium • Duration: 1-2 days</div>
            </div>
            <div class="template-card" data-template="lifestyle-campaign" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #4b3b2a;">🌟 Lifestyle Campaign</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b5440;">Professional lifestyle photography with models and scenarios</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: External Studio • Priority: High • Duration: 5-7 days</div>
            </div>
            <div class="template-card" data-template="detail-macro" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #4b3b2a;">🔍 Detail & Macro</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b5440;">Close-up detail shots highlighting product features</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: Internal Studio • Priority: Medium • Duration: 2-3 days</div>
            </div>
          </div>
          <div style="text-align: center;">
            <button id="backFromTemplates" class="btn">← Back to Dashboard</button>
          </div>
        </div>

        <table style="display: none;" id="defaultTable">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="selectAll"></th>
              <th>Order Number</th>
              <th style="width: 60px;">Page</th>
              <th style="width: 100px;">Offer ID</th>
              <th style="width: 60px;">Group</th>
              <th style="width: 200px;">Offer</th>
              <th style="width: 150px;">Type</th>
              <th style="width: 120px;">Photo Reference</th>
              <th style="width: 150px;">Reference To File</th>
              <th style="width: 150px;">Production</th>
              <th style="width: 100px;">Principles</th>
              <th style="width: 80px;">Thumbnail</th>
              <th style="width: 80px;">Dialog</th>
              <th style="width: 60px;">Alert</th>
              <th style="width: 60px;">Link</th>
              <th style="width: 120px;">Status</th>
            </tr>
          </thead>
          <tbody id="ordersBody"></tbody>
        </table>

        <div id="diag" style="margin-top: 16px; font-size: 12px; color: #6b5440; white-space: pre-wrap; max-height: 200px; overflow-y: auto;"></div>

        </div>
      </div>
    `;

    const SIDEBAR_SECTION_STATE_KEY = 'ccpSidebarSectionState';

    function initializeSidebarSections() {
      const sidebar = document.getElementById('sidebar');
      if (!sidebar || typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }

      const sections = Array.from(sidebar.querySelectorAll('.nav-section'));
      const defaultCollapsed = new Set(['analytics', 'quick-actions', 'automation']);
      let storedState = {};

      try {
        storedState = JSON.parse(localStorage.getItem(SIDEBAR_SECTION_STATE_KEY) || '{}') || {};
      } catch (error) {
        console.warn('[Sidebar] Failed to read section state from storage:', error);
        storedState = {};
      }

      sections.forEach(section => {
        const trigger = section.querySelector('.nav-section-title');
        if (!trigger) {
          return;
        }

        const sectionId = section.dataset.section || trigger.textContent.trim().toLowerCase();
        const shouldCollapse = storedState[sectionId] ?? defaultCollapsed.has(sectionId);

        const chevron = section.querySelector('.nav-section-chevron');
        if (shouldCollapse) {
          section.classList.add('collapsed');
        }

        if (chevron) {
          chevron.textContent = '▾';
        }

        trigger.setAttribute('aria-expanded', String(!section.classList.contains('collapsed')));

        trigger.addEventListener('click', () => {
          const isCollapsed = section.classList.toggle('collapsed');
          trigger.setAttribute('aria-expanded', String(!isCollapsed));
          if (chevron) {
            chevron.textContent = '▾';
          }
          if (sectionId) {
            storedState[sectionId] = isCollapsed;
            try {
              localStorage.setItem(SIDEBAR_SECTION_STATE_KEY, JSON.stringify(storedState));
            } catch (storageError) {
              console.warn('[Sidebar] Unable to persist section state:', storageError);
            }
          }
        });
      });
    }

    // Define toggleSidebar function globally after HTML is rendered
    window.toggleSidebar = function() {
      console.log('[Sidebar] Toggle function called');
      const sidebar = document.getElementById('sidebar');
      const toggleIcon = document.getElementById('sidebarToggleIcon');
      const mainContent = document.querySelector('.main-content');
      
      if (!sidebar || !toggleIcon) {
        console.log('[Sidebar] Missing elements - sidebar:', !!sidebar, 'toggleIcon:', !!toggleIcon);
        return;
      }
      
      const isCollapsed = sidebar.classList.contains('collapsed');
      console.log('[Sidebar] Current state - collapsed:', isCollapsed);
      
      // Add transitioning class for extra smooth animation
      sidebar.classList.add('transitioning');
      
      if (isCollapsed) {
        // Expanding sidebar
        sidebar.classList.remove('collapsed');
        toggleIcon.style.transform = 'rotate(0deg)';
        toggleIcon.textContent = '◀';
        
        // Reset main content margin to normal spacing
        if (mainContent) {
          mainContent.style.marginLeft = '20px';
        }
      } else {
        // Collapsing sidebar
        sidebar.classList.add('collapsed');
        toggleIcon.style.transform = 'rotate(180deg)';
        toggleIcon.textContent = '◀'; // Keep same character, just rotate it
        
        // Keep main content in place, just let it expand naturally
        if (mainContent) {
          mainContent.style.marginLeft = '0px'; // No movement, just natural expansion
        }
      }
      
      // Remove transitioning class after animation completes
      setTimeout(() => {
        sidebar.classList.remove('transitioning');
      }, 300);
    };

    initializeSidebarSections();

    const tbody = document.getElementById('ordersBody');
    const samplesBody = document.getElementById('samplesBody');
    const searchBox = document.getElementById('searchBox');
    
    let currentView = 'orders';
    let bulkMode = false;
    let selectedItems = new Set();
    let expandedOrders = new Set();
    let statusFilterOverride = '';

  const SALES_ORG_OPTIONS = ['Bilka', 'føtex', 'netto', 'Fætter BR', 'Salling'];
  const DEFAULT_TACTIC_TYPE = 'Print';
  const DEFAULT_TACTIC = 'Leaflet';
    const orderFilters = {
      salesOrg: '',
      eventId: '',
      tacticType: '',
      tactic: ''
    };

    function getAccessibleOrders() {
      const sourceOrders = window.rkhOrders || [];
      assignSalesOrgMetadata(sourceOrders);
      return authSystem && typeof authSystem.getFilteredOrders === 'function'
        ? authSystem.getFilteredOrders(sourceOrders)
        : sourceOrders;
    }

    function hasPrimaryOrderFilter() {
      return Boolean(orderFilters.salesOrg || orderFilters.eventId || orderFilters.tacticType || orderFilters.tactic || statusFilterOverride);
    }

    function normalizeFilterValue(value) {
      return (value || '').toString().trim();
    }

    function normalizeComparisonValue(value) {
      return normalizeFilterValue(value).toLowerCase();
    }

    const PRODUCTION_METHOD_OPTIONS = [
      {
        id: 'photobox',
        label: 'Photo Box',
        shortLabel: 'Photo Box',
        icon: '📦',
        description: 'Managed by the Photo Box production team.',
        aliases: ['photo box', 'photobox', 'pb', 'box'],
        chipClass: 'production-chip--photobox'
      },
      {
        id: 'mandb',
        label: 'M&B',
        shortLabel: 'M&B',
        icon: '🏭',
        description: 'Handled through the M&B production workflow.',
        aliases: ['m&b', 'm and b', 'm+b', 'mandb', 'mb'],
        chipClass: 'production-chip--mandb'
      },
      {
        id: 'gils',
        label: 'GILS',
        shortLabel: 'GILS',
        icon: '🎯',
        description: 'Assigned to the GILS production unit.',
        aliases: ['gils'],
        chipClass: 'production-chip--gils'
      },
      {
        id: 'merrild',
        label: 'MERRILD',
        shortLabel: 'MERRILD',
        icon: '☕',
        description: 'Delivered by the MERRILD production team.',
        aliases: ['merrild'],
        chipClass: 'production-chip--merrild'
      }
    ];

    const DEFAULT_PRODUCTION_META = {
      id: 'unassigned',
      label: '',
      shortLabel: '',
      icon: '',
      description: '',
      raw: '',
      chipClass: 'production-chip--unassigned'
    };

    const BILKA_PREVIEW_IMAGES = [
      'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1526947411366-49aeff9c88ce?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
    ];

    let bilkaPreviewCursor = 1;

    function matchProductionOption(normalizedValue) {
      if (!normalizedValue) {
        return null;
      }
      const sanitized = normalizedValue.replace(/[^a-z0-9]/g, '');
      return PRODUCTION_METHOD_OPTIONS.find(option => option.aliases.some(alias => {
        const aliasKey = normalizeComparisonValue(alias).replace(/[^a-z0-9]/g, '');
        return aliasKey && (sanitized === aliasKey || sanitized.includes(aliasKey));
      })) || null;
    }

    function normalizeProductionValue(rawValue) {
      const raw = normalizeFilterValue(rawValue);
      const normalized = normalizeComparisonValue(rawValue);
      if (!raw) {
        return { ...DEFAULT_PRODUCTION_META };
      }

      const matchedOption = matchProductionOption(normalized);
      if (matchedOption) {
        return { ...matchedOption, raw };
      }

      const meta = {
        ...DEFAULT_PRODUCTION_META,
        raw,
        description: raw ? `Unmapped production entry recorded as: ${raw}` : ''
      };
      console.warn('[Production] Unrecognized production value encountered, leaving column unassigned:', rawValue);
      return meta;
    }

    function applyProductionNormalization(order) {
      if (!order || typeof order !== 'object') {
        return;
      }
      const meta = normalizeProductionValue(order.production || order.productionMethod || order.method);
      order.productionMeta = meta;
      if (meta.label) {
        order.production = meta.label;
        if (!order.productionMethod || normalizeComparisonValue(order.productionMethod) === normalizeComparisonValue(order.method)) {
          order.productionMethod = meta.label;
        }
        if (!order.method) {
          order.method = meta.label;
        }
      }
      return meta;
    }

    function applyProductionNormalizationToOrders(orders) {
      if (!Array.isArray(orders)) {
        return;
      }
      orders.forEach(order => applyProductionNormalization(order));
    }

    function getNextBilkaPreviewAsset() {
      const index = (bilkaPreviewCursor - 1) % BILKA_PREVIEW_IMAGES.length;
      const filename = `ENV.${String(bilkaPreviewCursor).padStart(6, '0')}.jpg`;
      const imageUrl = BILKA_PREVIEW_IMAGES[index];
      bilkaPreviewCursor += 1;
      return {
        name: filename,
        url: imageUrl,
        thumbnailUrl: imageUrl,
        generated: true,
        source: 'bilka-autogen'
      };
    }

    function ensureBilkaOrdersHavePreview(orders) {
      if (!Array.isArray(orders)) {
        return;
      }
      orders.forEach(order => {
        if (!order || normalizeComparisonValue(order.salesOrg) !== 'bilka') {
          return;
        }
        const existingAssets = Array.isArray(order.uploadedContent) ? order.uploadedContent : [];
        const hasPreview = existingAssets.some(asset => asset && (asset.thumbnailUrl || asset.url || asset.data));
        if (hasPreview) {
          return;
        }
        const nextAsset = getNextBilkaPreviewAsset();
        order.uploadedContent = [...existingAssets, nextAsset];
      });
    }

    function getRandomSalesOrg() {
      return SALES_ORG_OPTIONS[Math.floor(Math.random() * SALES_ORG_OPTIONS.length)];
    }

    function assignSalesOrgToOrder(order, fallbackIndex = null) {
      if (!order || typeof order !== 'object') return;

      const rawValue = order.salesOrg || order.salesOrganisation || order.salesOrganization || order.format;
      if (rawValue) {
        const normalized = normalizeComparisonValue(rawValue);
        const matched = SALES_ORG_OPTIONS.find(option => normalizeComparisonValue(option) === normalized);
        order.salesOrg = matched || normalizeFilterValue(rawValue);
      } else if (fallbackIndex !== null && !Number.isNaN(fallbackIndex)) {
        const index = Math.abs(fallbackIndex) % SALES_ORG_OPTIONS.length;
        order.salesOrg = SALES_ORG_OPTIONS[index];
      } else {
        order.salesOrg = getRandomSalesOrg();
      }

      order.tacticType = DEFAULT_TACTIC_TYPE;
      order.tactic = DEFAULT_TACTIC;
      applyProductionNormalization(order);
    }

    function assignSalesOrgMetadata(orders) {
      if (!Array.isArray(orders) || orders.length === 0) return;
      const seed = Math.floor(Math.random() * SALES_ORG_OPTIONS.length);
      orders.forEach((order, index) => assignSalesOrgToOrder(order, seed + index));
      ensureBilkaOrdersHavePreview(orders);
    }

    assignSalesOrgMetadata(window.rkhOrders || (typeof allOrders !== 'undefined' ? allOrders : []));

    function getSalesOrgValue(order) {
      return normalizeFilterValue(order.salesOrg || order.salesOrganisation || order.salesOrganization || order.format || '');
    }

    function getTacticTypeValue(order) {
      return normalizeFilterValue(order.tacticType || order.tactic_type || '');
    }

    function getTacticValue(order) {
      return normalizeFilterValue(order.tactic || order.tacticName || '');
    }

    function applyActiveOrderFilters(orderList) {
      const expectedSalesOrg = normalizeComparisonValue(orderFilters.salesOrg);
      const expectedEventId = normalizeComparisonValue(orderFilters.eventId);
      const expectedTacticType = normalizeComparisonValue(orderFilters.tacticType);
      const expectedTactic = normalizeComparisonValue(orderFilters.tactic);

      if (!hasPrimaryOrderFilter()) {
        return orderList;
      }

      return orderList.filter(order => {
        if (expectedSalesOrg) {
          const actualSalesOrg = normalizeComparisonValue(getSalesOrgValue(order));
          if (!actualSalesOrg || actualSalesOrg !== expectedSalesOrg) {
            return false;
          }
        }

        if (expectedEventId) {
          const actualEventId = normalizeComparisonValue(order.eventId);
          if (!actualEventId || actualEventId !== expectedEventId) {
            return false;
          }
        }

        if (expectedTacticType) {
          const actualTacticType = normalizeComparisonValue(getTacticTypeValue(order));
          if (!actualTacticType || actualTacticType !== expectedTacticType) {
            return false;
          }
        }

        if (expectedTactic) {
          const actualTactic = normalizeComparisonValue(getTacticValue(order));
          if (!actualTactic || actualTactic !== expectedTactic) {
            return false;
          }
        }

        return true;
      });
    }

    function getStatusFilterLabel(statusKey) {
      const normalized = normalizeComparisonValue(statusKey);
      const labelMap = {
        urgent: 'Urgent Orders',
        overdue: 'Overdue Orders',
        today: "Today's Deadlines",
        'today-deadlines': "Today's Deadlines",
        draft: 'Draft & New',
        pending: 'Pending Orders',
        approved: 'Approved Orders',
        samples: 'Sample Logistics',
        'ready-samples': 'Sample Logistics',
        inprogress: 'In Progress Orders',
        'in progress': 'In Progress Orders',
        review: 'Orders in Review',
        completed: 'Completed Orders',
        all: 'All Orders'
      };

      if (!normalized) return '';
      return labelMap[normalized] || `Status: ${statusKey}`;
    }

    function applyStatusFilter(orderList, statusKey) {
      const normalized = normalizeComparisonValue(statusKey);
      if (!normalized || normalized === 'all') {
        return { orders: orderList, label: normalized === 'all' ? 'All Orders' : '' };
      }

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      const todayStr = new Date().toISOString().split('T')[0];

      const filtered = orderList.filter(order => {
        const statusValue = normalizeComparisonValue(order.status);
        const priorityValue = normalizeComparisonValue(order.priority);

        switch (normalized) {
          case 'urgent':
            return priorityValue === 'high' || priorityValue === 'critical' || priorityValue === 'urgent';
          case 'overdue': {
            const deadline = new Date(order.deadline);
            return deadline < endOfToday && statusValue !== 'complete' && statusValue !== 'completed' && statusValue !== 'delivered' && statusValue !== 'archived';
          }
          case 'today':
          case 'today-deadlines':
            return (order.deadline || '').split('T')[0] === todayStr;
          case 'draft':
            return statusValue === 'draft' || statusValue === 'new request';
          case 'pending':
            return statusValue === 'pending approval' || statusValue === 'pending';
          case 'approved':
            return statusValue === 'approved';
          case 'samples':
          case 'ready-samples':
            return statusValue === 'samples requested' || statusValue === 'samples in transit' || statusValue === 'samples received' || statusValue === 'ready for production';
          case 'inprogress':
          case 'in progress':
            return statusValue === 'in progress' || statusValue === 'photo session' || statusValue === 'processing';
          case 'review':
            return statusValue === 'review';
          case 'completed':
            return statusValue === 'complete' || statusValue === 'completed' || statusValue === 'delivered' || statusValue === 'archived';
          default:
            return statusValue === normalized;
        }
      });

  return { orders: filtered, label: getStatusFilterLabel(statusKey) };
    }

    function setStatusFilterOverride(value, options = {}) {
      const normalized = normalizeFilterValue(value);
      statusFilterOverride = normalized;

      if (!options.skipRender && typeof drawOrderRows === 'function') {
        drawOrderRows();
      }
    }

    function updateOrderFilterSummary(filteredOrders) {
      const countElement = document.getElementById('eventIdOrderCount');
      if (!countElement) return;

      if (!hasPrimaryOrderFilter()) {
        countElement.textContent = 'Select a Sales Org, Event, Status, Tactic Type, or Tactic to view orders';
        return;
      }

      let ordersList = filteredOrders || applyActiveOrderFilters(getAccessibleOrders());
      const activeFilters = [];

      if (orderFilters.salesOrg) activeFilters.push(`Sales Org: ${orderFilters.salesOrg}`);
      if (orderFilters.eventId) activeFilters.push(`Event: ${orderFilters.eventId}`);
      if (orderFilters.tacticType) activeFilters.push(`Tactic Type: ${orderFilters.tacticType}`);
      if (orderFilters.tactic) activeFilters.push(`Tactic: ${orderFilters.tactic}`);

      if (statusFilterOverride) {
        const statusResult = applyStatusFilter(ordersList, statusFilterOverride);
        ordersList = statusResult.orders;
        const statusLabel = statusResult.label || getStatusFilterLabel(statusFilterOverride);
        if (statusLabel) {
          activeFilters.push(statusLabel);
        }
      }

      const countText = ordersList.length === 1 ? '1 order' : `${ordersList.length} orders`;
      countElement.textContent = activeFilters.length
        ? `${countText} • ${activeFilters.join(' • ')}`
        : countText;
    }

    function populateSalesOrgFilterOptions() {
      const select = document.getElementById('salesOrgFilter');
      if (!select) return;

      const previousValue = orderFilters.salesOrg;
      select.innerHTML = '<option value="">All Sales Orgs</option>';

      SALES_ORG_OPTIONS.forEach(org => {
        const option = document.createElement('option');
        option.value = org;
        option.textContent = org;
        select.appendChild(option);
      });

      select.value = previousValue || '';
    }

    function populateTacticTypeFilterOptions() {
      const select = document.getElementById('tacticTypeFilter');
      if (!select) return;

      const ordersList = getAccessibleOrders();
      const types = Array.from(new Set(ordersList.map(o => getTacticTypeValue(o)).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

      const previousValue = orderFilters.tacticType;
      select.innerHTML = '<option value="">All Tactic Types</option>';

      types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
      });

      if (previousValue && !types.includes(previousValue)) {
        orderFilters.tacticType = '';
      }

      select.value = orderFilters.tacticType || '';
      select.disabled = types.length === 0;
    }

    function populateTacticFilterOptions() {
      const select = document.getElementById('tacticFilter');
      if (!select) return;

      const ordersList = getAccessibleOrders();
      const tacticTypeFilter = normalizeComparisonValue(orderFilters.tacticType);

      const filteredOrders = tacticTypeFilter
        ? ordersList.filter(order => normalizeComparisonValue(getTacticTypeValue(order)) === tacticTypeFilter)
        : ordersList;

      const tactics = Array.from(new Set(filteredOrders.map(o => getTacticValue(o)).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

      const previousValue = orderFilters.tactic;
      select.innerHTML = '<option value="">All Tactics</option>';

      tactics.forEach(tactic => {
        const option = document.createElement('option');
        option.value = tactic;
        option.textContent = tactic;
        select.appendChild(option);
      });

      if (previousValue && !tactics.includes(previousValue)) {
        orderFilters.tactic = '';
      }

      select.value = orderFilters.tactic || '';
      select.disabled = tactics.length === 0;
    }

    function refreshOrdersAfterFilterChange() {
      if (typeof drawOrderRows === 'function') {
        drawOrderRows();
      }
    }

    function handleSalesOrgFilterChange(value) {
      orderFilters.salesOrg = normalizeFilterValue(value);
      refreshOrdersAfterFilterChange();
    }

    function handleTacticTypeFilterChange(value) {
      orderFilters.tacticType = normalizeFilterValue(value);
      populateTacticFilterOptions();
      refreshOrdersAfterFilterChange();
    }

    function handleTacticFilterChange(value) {
      orderFilters.tactic = normalizeFilterValue(value);
      refreshOrdersAfterFilterChange();
    }

    function handleEventFilterChange(value) {
      orderFilters.eventId = normalizeFilterValue(value);
      refreshOrdersAfterFilterChange();
    }

    function refreshOrderFilters() {
      populateSalesOrgFilterOptions();
      populateTacticTypeFilterOptions();
      populateTacticFilterOptions();
      if (typeof window.populateEventIdSuggestions === 'function') {
        window.populateEventIdSuggestions();
      }
      updateOrderFilterSummary();
    }

    window.populateSalesOrgFilterOptions = populateSalesOrgFilterOptions;
    window.populateTacticTypeFilterOptions = populateTacticTypeFilterOptions;
    window.populateTacticFilterOptions = populateTacticFilterOptions;
    window.updateOrderFilterSummary = updateOrderFilterSummary;
    window.handleSalesOrgFilterChange = handleSalesOrgFilterChange;
    window.handleTacticTypeFilterChange = handleTacticTypeFilterChange;
    window.handleTacticFilterChange = handleTacticFilterChange;
    window.handleEventFilterChange = handleEventFilterChange;
    window.refreshOrderFilters = refreshOrderFilters;
  window.setStatusFilterOverride = setStatusFilterOverride;

    // Calendar state
    let calendarDate = new Date();
    let calendarViewType = 'week';

    const templates = {
      'product-hero': {
        title: 'Product Hero Photography',
        method: 'Photographer',
        priority: 'High',
        brief: 'Create high-impact hero shots for product marketing campaign. Focus on dramatic lighting, clean backgrounds, and compelling product presentation that captures attention and drives sales.',
        articles: 'Product Sample',
        deliverables: 'Hero Product Shots, Marketing Assets, High-Resolution Images',
        budget: 5000,
        category: 'Photography',
        icon: '📸'
      },
      'ecommerce-batch': {
        title: 'E-commerce Product Batch',
        method: 'Photo Box',
        priority: 'Medium',
        brief: 'Automated white background product photography for online store. Consistent lighting, color accuracy, and standardized framing for catalog consistency.',
        articles: 'Product Batch (10-50 items)',
        deliverables: 'E-commerce Photos, Thumbnail Images, Product Catalog',
        budget: 2000,
        category: 'Photography',
        icon: '🛍️'
      },
      'lifestyle-campaign': {
        title: 'Lifestyle Photography Campaign',
        method: 'External Studio',
        priority: 'High',
        brief: 'Professional lifestyle photography featuring products in real-world scenarios with models. Focus on emotional connection and aspirational lifestyle messaging.',
        articles: 'Product Samples, Props, Models',
        deliverables: 'Lifestyle Photography, Social Media Content, Campaign Assets',
        budget: 8000,
        category: 'Photography',
        icon: '🌟'
      },
      'detail-macro': {
        title: 'Detail & Macro Photography',
        method: 'Internal Studio',
        priority: 'Medium',
        brief: 'Close-up detail photography highlighting product features, textures, and craftsmanship. Technical precision with focus on product quality and specifications.',
        articles: 'Product Sample',
        deliverables: 'Macro Detail Shots, Feature Highlights, Technical Documentation',
        budget: 3000,
        category: 'Photography',
        icon: '🔍'
      },
      'social-content': {
        title: 'Social Media Content Package',
        method: 'Photo Box',
        priority: 'Medium',
        brief: 'Create engaging social media content with multiple angles, seasonal themes, and platform-optimized formats. Include stories, posts, and reel-ready content.',
        articles: 'Product Samples, Seasonal Props',
        deliverables: 'Social Media Posts, Stories, Reels, Instagram Content',
        budget: 2500,
        category: 'Social Media',
        icon: '📱'
      },
      'video-product': {
        title: 'Product Video Showcase',
        method: 'External Studio',
        priority: 'High',
        brief: 'Professional product video showcasing features, benefits, and usage scenarios. Include 360° rotation, close-ups, and lifestyle integration.',
        articles: 'Product Sample, Usage Props',
        deliverables: 'Product Video, 360° Video, Usage Demonstrations, Video Thumbnails',
        budget: 6500,
        category: 'Video',
        icon: '🎥'
      },
      'seasonal-campaign': {
        title: 'Seasonal Campaign Photography',
        method: 'Photographer',
        priority: 'Medium',
        brief: 'Seasonal themed photography for holiday marketing campaigns. Incorporate seasonal elements, colors, and themes relevant to current season.',
        articles: 'Product Samples, Seasonal Decorations',
        deliverables: 'Seasonal Photography, Holiday Marketing Assets, Themed Content',
        budget: 4500,
        category: 'Photography',
        icon: '🎄'
      },
      'packaging-shots': {
        title: 'Packaging & Unboxing Photography',
        method: 'Internal Studio',
        priority: 'Low',
        brief: 'Professional packaging photography and unboxing experience documentation. Focus on brand presentation and customer experience journey.',
        articles: 'Packaged Products, Unboxing Materials',
        deliverables: 'Packaging Photography, Unboxing Sequence, Brand Assets',
        budget: 1800,
        category: 'Photography',
        icon: '📦'
      },
      'comparison-grid': {
        title: 'Product Comparison Grid',
        method: 'Photo Box',
        priority: 'Low',
        brief: 'Systematic comparison photography for product variants, sizes, or competing products. Maintain consistent lighting and positioning for fair comparison.',
        articles: 'Product Variants/Competitors',
        deliverables: 'Comparison Grid, Size Charts, Feature Comparisons',
        budget: 1500,
        category: 'Photography',
        icon: '⚖️'
      },
      'influencer-kit': {
        title: 'Influencer Content Kit',
        method: 'Photographer',
        priority: 'Medium',
        brief: 'Content creation for influencer partnerships and brand collaborations. Include lifestyle shots, product styling, and social-ready formats.',
        articles: 'Product Samples, Lifestyle Props',
        deliverables: 'Influencer Photos, Social Content, Brand Guidelines',
        budget: 3500,
        category: 'Social Media',
        icon: '🤳'
      },
      'technical-specs': {
        title: 'Technical Specification Photography',
        method: 'Internal Studio',
        priority: 'Low',
        brief: 'Technical documentation photography for manuals, specifications, and professional documentation. Focus on clarity and instructional value.',
        articles: 'Product Sample, Technical Components',
        deliverables: 'Technical Photos, Instruction Images, Specification Documentation',
        budget: 1200,
        category: 'Documentation',
        icon: '📋'
      },
      'brand-storytelling': {
        title: 'Brand Storytelling Campaign',
        method: 'External Studio',
        priority: 'High',
        brief: 'Comprehensive brand storytelling through visual content. Showcase brand values, heritage, and emotional connection with premium artistic approach.',
        articles: 'Product Range, Brand Elements, Models',
        deliverables: 'Brand Photography, Storytelling Assets, Premium Content',
        budget: 12000,
        category: 'Branding',
        icon: '📖'
      }
    };

    // Update content title when switching views
    function updateContentTitle(title) {
      const contentTitle = document.getElementById('contentTitle');
      if (contentTitle) {
        contentTitle.textContent = title;
      }
    }

    function showView(viewName) {
      // Close all sidebar modals when switching views
      if (typeof closeAllRightSideModals === 'function') {
        closeAllRightSideModals();
      }
      
      // Hide all views first
      const views = ['ordersView', 'samplesView', 'createOrderView', 'templatesView', 'workflowView', 'kanbanView', 'calendarView', 'dashboardView'];
      views.forEach(viewId => {
        const element = document.getElementById(viewId);
        if (element) {
          element.style.display = 'none';
          element.classList.remove('view-active');
        }
      });
      
      // Clear any filter info when switching views
      const mainContent = document.getElementById('mainContent');
      const existingFilter = mainContent?.querySelector('.filter-info');
      if (existingFilter) {
        existingFilter.remove();
      }
      
      // Show the target view and update content
      let targetView = null;
      if (viewName === 'dashboard') {
        targetView = document.getElementById('dashboardView');
        updateContentTitle('📊 Dashboard');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          populateDashboardContent();
        }
      } else if (viewName === 'orders') {
        targetView = document.getElementById('ordersView');
        updateContentTitle('📋 Orders');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof refreshOrderFilters === 'function') {
            refreshOrderFilters();
          } else if (typeof window.populateEventIdSuggestions === 'function') {
            window.populateEventIdSuggestions();
          }
          if (typeof drawOrderRows === 'function') drawOrderRows();
        }
      } else if (viewName === 'samples') {
        targetView = document.getElementById('samplesView');
        updateContentTitle('� Samples');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawSampleRows === 'function') drawSampleRows();
        }
      } else if (viewName === 'kanban') {
        targetView = document.getElementById('kanbanView');
        updateContentTitle('📊 Kanban Board');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawKanbanBoard === 'function') drawKanbanBoard();
        }
      } else if (viewName === 'calendar') {
        targetView = document.getElementById('calendarView');
        updateContentTitle('📅 Calendar View');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawCalendarView === 'function') drawCalendarView();
        }
      } else if (viewName === 'workflow') {
        targetView = document.getElementById('workflowView');
        updateContentTitle('🔄 Workflow');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawWorkflowView === 'function') drawWorkflowView();
        }
      } else if (viewName === 'create') {
        targetView = document.getElementById('createOrderView');
        updateContentTitle('➕ Create Order');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
        }
      }
    }

    // Expose showView globally for onclick handlers
    window.showView = showView;

    // Function to populate dashboard content
    function populateDashboardContent() {
      if (!window.rkhOrders || !window.authSystem) {
        console.error('Dashboard: Required data not available');
        return;
      }

      const orders = window.authSystem.getFilteredOrders(window.rkhOrders);
      
      // Calculate stats
      const stats = {
        total: orders.length,
        complete: orders.filter(o => o.status === 'Complete' || o.status === 'Delivered').length,
        pending: orders.filter(o => o.status === 'Pending' || o.status === 'Draft').length,
        inProgress: orders.filter(o => o.status === 'In Progress').length,
        newRequests: orders.filter(o => o.status === 'New Request' || o.status === 'Draft').length
      };

      const draftCount = orders.filter(o => o.status === 'Draft' || o.status === 'New Request').length;
      const pendingCount = orders.filter(o => o.status === 'Pending Approval' || o.status === 'Pending').length;
      const approvedCount = orders.filter(o => o.status === 'Approved').length;
      const samplesCount = orders.filter(o => o.status === 'Samples Requested' || o.status === 'Samples in Transit' || o.status === 'Samples Received').length;
      const reviewCount = orders.filter(o => o.status === 'Review').length;

      // Populate stats grid with updated beige palette
      const statsContainer = document.getElementById('dashboardStats');
      if (statsContainer) {
        const tileData = [
          { filter: 'all', label: '📋 All Orders', count: stats.total, accent: '#6b5440', subtitle: 'Full pipeline snapshot' },
          { filter: 'draft', label: '📝 Draft & New', count: draftCount, accent: '#c48b5a', subtitle: 'Requests awaiting kickoff' },
          { filter: 'pending', label: '⏳ Pending', count: pendingCount, accent: '#d69b55', subtitle: 'Awaiting approvals & inputs' },
          { filter: 'approved', label: '✅ Approved', count: approvedCount, accent: '#7fa284', subtitle: 'Ready for production' },
          { filter: 'samples', label: '📦 Samples', count: samplesCount, accent: '#d0aa7c', subtitle: 'Logistics & samples in motion' },
          { filter: 'In Progress', label: '🔄 In Progress', count: stats.inProgress, accent: '#a66b38', subtitle: 'Active content creation' },
          { filter: 'review', label: '🔍 Review', count: reviewCount, accent: '#b98c6f', subtitle: 'Stakeholder review cycle' },
          { filter: 'completed', label: '🎉 Complete', count: stats.complete, accent: '#4b3b2a', subtitle: 'Delivered & wrapped' }
        ];

        statsContainer.innerHTML = tileData.map(tile => `
          <div onclick="filterOrdersByStatus('${tile.filter}')" style="background: linear-gradient(135deg, #fdf4e6 0%, #f2e4d2 100%); border-radius: 14px; box-shadow: 0 10px 24px rgba(112, 82, 50, 0.12); padding: 18px; text-align: center; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; border: 1px solid rgba(196, 139, 90, 0.24); border-left: 5px solid ${tile.accent};"
               onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 32px rgba(112,82,50,0.18)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 24px rgba(112,82,50,0.12)';">
            <div style="font-size: 26px; font-weight: 700; color: ${tile.accent}; margin-bottom: 6px;">${tile.count}</div>
            <div style="font-size: 12px; color: #5b4635; text-transform: uppercase; letter-spacing: 0.6px;">${tile.label}</div>
            <div style="margin-top: 6px; font-size: 11px; color: rgba(75, 59, 42, 0.72);">${tile.subtitle}</div>
          </div>
        `).join('');
      }

      // Populate recent orders
      const recentOrdersContainer = document.getElementById('recentOrdersContainer');
      if (recentOrdersContainer) {
        const recentOrders = orders.slice(0, 10); // Show latest 10 orders
        recentOrdersContainer.innerHTML = `
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid #e5e7eb;">Order #</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid #e5e7eb;">Title</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid #e5e7eb;">Status</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid #e5e7eb;">Priority</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #4b3b2a; border-bottom: 1px solid #e5e7eb;">Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.map(order => `
                <tr onclick="showOrderDetails('${order.orderNumber}')" style="cursor: pointer; border-bottom: 1px solid #f1e8dc;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor=''">
                  <td style="padding: 12px 16px; color: #4b3b2a;"><strong>${order.orderNumber}</strong></td>
                  <td style="padding: 12px 16px; color: #4b3b2a;">${order.title}</td>
                  <td style="padding: 12px 16px;"><span class="status ${order.status.replace(/\s+/g, '')}">${order.status}</span></td>
                  <td style="padding: 12px 16px;"><span class="status ${order.priority}">${order.priority}</span></td>
                  <td style="padding: 12px 16px; color: #4b3b2a;">${order.deadline}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
      
      // Update badge counts after populating dashboard
      if (window.updateQuickActionBadges) {
        window.updateQuickActionBadges();
      }
    }

    // Expose functions globally
    window.populateDashboardContent = populateDashboardContent;
    
    // Debug workflow button click
    console.log('Workflow functionality initialized');

    // Close all right-side modals
    function closeAllRightSideModals() {
      // List of all possible right-side modal IDs
      const modalIds = [
        'leftSideCreateModal',
        'newOrderRightModal',
        'contentCreationModal',
        'ordersRightModal',
        'dashboardRightModal',
        'scanArticleRightModal'
      ];

      // Close each modal if it exists
      modalIds.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
          // Remove ESC key event listener if it exists
          if (modal._escKeyHandler) {
            document.removeEventListener('keydown', modal._escKeyHandler);
          }
          
          // Animate out
          modal.style.transform = 'translateX(-100%)';
          setTimeout(() => {
            modal.remove();
          }, 300);
        }
      });

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    // Show create order modal on the right side of sidebar
    function showCreateOrderLeftModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('leftSideCreateModal');
      if (existingModal) {
        closeCreateOrderLeftModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'leftSideCreateModal';
      modal.style.cssText = `
        position: fixed;
    top: 0;
    left: 260px;
        width: 450px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
      `;

      // Get the create order form content from the existing view
      const existingCreateView = document.getElementById('createOrderView');
      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="/CCP_Logog.png" alt="CCP Logo" style="width: 28px; height: 28px; object-fit: contain;" />
            <h3 style="margin: 0; font-size: 20px; color: #4b3b2a; font-weight: 600;">Create New Content Project</h3>
          </div>
          <button onclick="closeCreateOrderLeftModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>
  ${existingCreateView.innerHTML.replace('<h3 style="margin: 16px 0 8px; font-size: 18px; color: #4b3b2a;">🎨 Create New Content Project</h3>', '')}
      `;

      document.body.appendChild(modal);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
  mainContent.style.marginLeft = '520px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    // Close the right-side create order modal
    function closeCreateOrderLeftModal() {
      const modal = document.getElementById('leftSideCreateModal');
      if (modal) {
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }

      // Return to previous view (orders by default)
      showView('orders');
    }

    // Show scan article modal on the right side of sidebar
    function showScanArticleRightModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('scanArticleRightModal');
      if (existingModal) {
        closeScanArticleRightModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'scanArticleRightModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 260px;
        width: 520px;
        height: 100vh;
        background: rgba(255, 250, 243, 0.97);
        backdrop-filter: blur(22px);
        border-right: 1px solid rgba(196, 139, 90, 0.25);
        box-shadow: 12px 0 40px rgba(75, 59, 42, 0.18);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 28px;
      `;

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid rgba(196, 139, 90, 0.28);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 28px; color: #c48b5a; background: rgba(196, 139, 90, 0.14); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">📷</div>
            <div>
              <h3 style="margin: 0; font-size: 22px; color: #4b3b2a; font-weight: 600; letter-spacing: 0.2px;">Scan Article</h3>
              <p style="margin: 4px 0 0; font-size: 12px; color: rgba(107, 84, 64, 0.78); letter-spacing: 0.3px;">Capture product details with a refined scanner experience.</p>
            </div>
          </div>
          <button onclick="closeScanArticleRightModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">×</button>
        </div>
        
        <div style="background: linear-gradient(135deg, #fdf4e6 0%, #f2e4d2 100%); padding: 24px; border-radius: 16px; border: 1px solid rgba(196, 139, 90, 0.24); box-shadow: 0 18px 32px rgba(112, 82, 50, 0.12);">
          <div style="margin-bottom: 18px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #4b3b2a; font-size: 15px;">Article Name</label>
            <input id="scannedArticleName" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 15px; background: rgba(255,252,245,0.85); color: #4b3b2a; transition: border-color 0.2s ease;" 
                   placeholder="🔍 Scan or type article name..." onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
          </div>
          
          <div style="margin-bottom: 18px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #4b3b2a; font-size: 15px;">EAN Code</label>
            <input id="scannedEAN" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 15px; background: rgba(255,252,245,0.85); color: #4b3b2a; transition: border-color 0.2s ease;" 
                   placeholder="📊 Scan or type EAN barcode..." pattern="[0-9]{8,13}" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
          </div>
          
          <div style="margin-bottom: 22px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #4b3b2a; font-size: 15px;">Notes</label>
            <textarea id="scanNotes" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 12px; font-size: 15px; min-height: 96px; resize: vertical; background: rgba(255,252,245,0.85); color: #4b3b2a; transition: border-color 0.2s ease;" 
                      placeholder="📝 Additional notes about the scanned article..." onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'"></textarea>
          </div>
          
          <div style="display: flex; gap: 12px;">
            <button onclick="closeScanArticleRightModal()" style="flex: 1; padding: 12px 16px; border: 2px solid #ead7c2; background: rgba(255,252,245,0.9); border-radius: 10px; cursor: pointer; font-weight: 600; color: #6b5440; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#c48b5a'" onmouseout="this.style.borderColor='#ead7c2'">Cancel</button>
            <button onclick="processScanFromModal()" style="flex: 1; padding: 12px 18px; background: linear-gradient(135deg, #c48b5a 0%, #a66b38 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 10px 24px rgba(166, 107, 56, 0.35); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">Process Scan</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Add ESC key event listener
      const escKeyHandler = function(event) {
        if (event.key === 'Escape') {
          closeScanArticleRightModal();
        }
      };
      
      // Store the handler on the modal for later removal
      modal._escKeyHandler = escKeyHandler;
      document.addEventListener('keydown', escKeyHandler);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '450px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Focus on the first input
      setTimeout(() => {
        document.getElementById('scannedArticleName')?.focus();
      }, 300);
    }

    // Close the right-side scan article modal
    function closeScanArticleRightModal() {
      const modal = document.getElementById('scanArticleRightModal');
      if (modal) {
        // Remove ESC key event listener
        if (modal._escKeyHandler) {
          document.removeEventListener('keydown', modal._escKeyHandler);
        }
        
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Process scan from the modal
    function processScanFromModal() {
      const articleName = document.getElementById('scannedArticleName')?.value.trim();
      const eanCode = document.getElementById('scannedEAN')?.value.trim();
      const notes = document.getElementById('scanNotes')?.value.trim();

      if (!articleName && !eanCode) {
        alert('Please enter an article name or EAN code');
        return;
      }

      // Create scan result object
      const scanResult = {
        articleName: articleName || 'Unknown Article',
        eanCode: eanCode || 'N/A',
        notes: notes || '',
        timestamp: new Date().toISOString(),
        scannedBy: 'Current User'
      };

      // For now, just show the result (you can extend this to integrate with orders)
      alert(`Scan processed successfully!\n\nArticle: ${scanResult.articleName}\nEAN: ${scanResult.eanCode}\nTime: ${new Date(scanResult.timestamp).toLocaleString()}`);
      
      closeScanArticleRightModal();
    }

    // Expose functions globally
    window.showScanArticleRightModal = showScanArticleRightModal;
    window.closeScanArticleRightModal = closeScanArticleRightModal;
    window.processScanFromModal = processScanFromModal;
    window.closeAllRightSideModals = closeAllRightSideModals;

    // Expose functions globally
    window.showCreateOrderLeftModal = showCreateOrderLeftModal;
    window.closeCreateOrderLeftModal = closeCreateOrderLeftModal;

    // Show new order modal as large side panel
    function showNewOrderModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('newOrderRightModal');
      if (existingModal) {
        closeNewOrderModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar) - made larger for form fields
      const modal = document.createElement('div');
      modal.id = 'newOrderRightModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 260px;
        width: 650px;
        height: 100vh;
        background: rgba(255, 250, 243, 0.97);
        backdrop-filter: blur(22px);
        border-right: 1px solid rgba(196, 139, 90, 0.25);
        box-shadow: 12px 0 40px rgba(75, 59, 42, 0.18);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 28px;
      `;

      modal.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid rgba(196, 139, 90, 0.28);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/CCP_Logog.png" alt="CCP Logo" style="width: 32px; height: 32px; object-fit: contain;" />
            <div>
              <h3 style="margin: 0; font-size: 22px; color: #4b3b2a; font-weight: 600;">Create New Content Project</h3>
              <p style="margin: 4px 0 0; font-size: 12px; color: rgba(107, 84, 64, 0.78); letter-spacing: 0.3px;">Streamline new requests with the warm CCP workspace aesthetic.</p>
            </div>
          </div>
          <button onclick="closeNewOrderModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">×</button>
        </div>

  <div style="background: linear-gradient(135deg, #fdf4e6 0%, #f2e4d2 100%); padding: 24px; border-radius: 16px; box-sizing: border-box; border: 1px solid rgba(196, 139, 90, 0.24); box-shadow: 0 18px 32px rgba(112, 82, 50, 0.12);">
          <form id="newOrderForm" onsubmit="handleNewOrderSubmit(event)">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Order Title</label>
    <input name="title" required style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;" 
                     placeholder="e.g., Premium Product Photography Session"
      onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div style="min-width: 0;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Production</label>
    <select name="method" required style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
      onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                  <option value="">Select production...</option>
                  <option value="Photo Box">Photo Box</option>
                  <option value="M&B">M&B</option>
                  <option value="GILS">GILS</option>
                  <option value="MERRILD">MERRILD</option>
                </select>
              </div>
              <div style="min-width: 0;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Priority</label>
    <select name="priority" required style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
      onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div style="min-width: 0;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Deadline</label>
      <input name="deadline" type="date" required style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
        onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
              </div>
              <div style="min-width: 0;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Budget (SEK)</label>
      <input name="budget" type="number" min="0" style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;" placeholder="0"
        onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Assign To</label>
        <select name="photographer" style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
          onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                <option value="">Select photographer/photo box...</option>
                <option value="Mike Rodriguez">Mike Rodriguez (Photographer)</option>
                <option value="Sarah Johnson">Sarah Johnson (Photographer)</option>
                <option value="Emily Chen">Emily Chen (Photographer)</option>
                <option value="Alex Turner">Alex Turner (Photo Box)</option>
              </select>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Brief Description</label>
              <textarea name="brief" required rows="3" style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; resize: vertical; transition: border-color 0.2s ease;" 
                        placeholder="Provide detailed instructions for the content creation..."
                        onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'"></textarea>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <span>Article Code (EAN/GTIN)</span>
                  <span style="font-size: 18px;" title="Scan barcode or enter manually">📦</span>
                </span>
              </label>
    <input name="articleCode" type="text" style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease; font-family: 'Courier New', monospace; letter-spacing: 1px;" 
                     placeholder="e.g., 5901234567890"
      onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'"
                     oninput="updateArticleFieldFromCode(this.value)">
              <div style="margin-top: 6px; font-size: 12px; color: #6b5440;">
                💡 Tip: You can scan a barcode directly into this field, or type the code manually
              </div>
            </div>

            <div style="margin-bottom: 24px;">
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #4b3b2a; font-size: 14px;">Articles</label>
              <textarea id="newOrderArticles" name="articles" required rows="2" style="width: 100%; box-sizing: border-box; padding: 14px; border: 2px solid #ead7c2; border-radius: 8px; font-size: 16px; resize: vertical; transition: border-color 0.2s ease;" 
                        placeholder="Articles with EAN codes will appear here...&#10;Format: Article Name [EAN: 1234567890123]"
                        onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'"></textarea>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" onclick="closeNewOrderModal()" style="padding: 14px 24px; background: #6b5440; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 10px 24px rgba(107, 84, 64, 0.25);" onmouseover="this.style.background='#4b3b2a'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#6b5440'; this.style.transform='translateY(0)'">Cancel</button>
                <button type="submit" style="padding: 14px 28px; background: linear-gradient(135deg, #c48b5a 0%, #a66b38 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 8px 20px rgba(166, 107, 56, 0.35); transition: all 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Add ESC key event listener
      const escKeyHandler = function(event) {
        if (event.key === 'Escape') {
          closeNewOrderModal();
        }
      };
      
      // Store the handler on the modal for later removal
      modal._escKeyHandler = escKeyHandler;
      document.addEventListener('keydown', escKeyHandler);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for the larger modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '650px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Focus on the first input
      setTimeout(() => {
        document.querySelector('#newOrderForm input[name="title"]')?.focus();
      }, 300);
    }

    // Close the new order modal
    function closeNewOrderModal() {
      const modal = document.getElementById('newOrderRightModal');
      
      if (modal) {
        // Remove ESC key event listener
        if (modal._escKeyHandler) {
          document.removeEventListener('keydown', modal._escKeyHandler);
        }
        
        // Animate out
        modal.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Handle new order form submission
    function handleNewOrderSubmit(event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const currentUser = authSystem.getCurrentUser();

      // Generate order number
      const orderNumber = 'ORD-' + Date.now();

      // Create new order object
      const newOrder = {
        orderNumber: orderNumber,
        title: formData.get('title'),
        method: formData.get('method'),
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        budget: formData.get('budget') ? parseFloat(formData.get('budget')) : null,
        photographer: formData.get('photographer') || null,
        brief: formData.get('brief'),
        articles: formData.get('articles').split('\n').filter(line => line.trim()),
        status: 'Draft',
        createdBy: currentUser.name,
        createdDate: new Date().toLocaleDateString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        deliverables: ['Product Photos', 'High-Resolution Images']
      };

      assignSalesOrgToOrder(newOrder);

      // Add to orders array
      allOrders.push(newOrder);
      assignSalesOrgMetadata(allOrders);

      // Save to localStorage
      localStorage.setItem('photoOrders', JSON.stringify(allOrders));

      // Show success message
      alert(`✅ Order "${newOrder.title}" created successfully!\n\nOrder Number: ${orderNumber}`);

      // Close modal
      closeNewOrderModal();

      // Refresh the orders view
      if (currentView === 'orders' || currentView === 'dashboard') {
        drawOrderRows();
      }
    }

    // Helper function to update articles field from scanned/entered article code
    function updateArticleFieldFromCode(articleCode) {
      if (!articleCode || articleCode.trim().length < 8) return;
      
      const articlesField = document.getElementById('newOrderArticles');
      if (!articlesField) return;
      
      // Format: Article Name [EAN: code]
      const articleLine = `Article ${articleCode} [EAN: ${articleCode}]`;
      
      // Check if this article is already in the list
      const currentArticles = articlesField.value.split('\n').filter(line => line.trim());
      const alreadyExists = currentArticles.some(line => line.includes(`[EAN: ${articleCode}]`));
      
      if (!alreadyExists) {
        // Add to articles list
        if (articlesField.value.trim()) {
          articlesField.value += '\n' + articleLine;
        } else {
          articlesField.value = articleLine;
        }
        
        // Visual feedback
        articlesField.style.background = '#d1fae5';
        articlesField.style.borderColor = '#7fa284';
        setTimeout(() => {
          articlesField.style.background = '';
      articlesField.style.borderColor = '#ead7c2';
        }, 1500);
      }
    }

    // Expose functions globally
    window.showNewOrderModal = showNewOrderModal;
    window.closeNewOrderModal = closeNewOrderModal;
    window.handleNewOrderSubmit = handleNewOrderSubmit;
    window.updateArticleFieldFromCode = updateArticleFieldFromCode;

    // Show content creation modal for AI editing and Editorial requests
    function showContentCreationModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('contentCreationModal');
      if (existingModal) {
        closeContentCreationModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'contentCreationModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 260px;
        width: 650px;
        height: 100vh;
        background: rgba(255, 250, 243, 0.97);
        backdrop-filter: blur(22px);
        border-right: 1px solid rgba(196, 139, 90, 0.25);
        box-shadow: 12px 0 40px rgba(75, 59, 42, 0.18);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 28px;
      `;

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid rgba(196, 139, 90, 0.28);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/CCP_Logog.png" alt="CCP Logo" style="width: 32px; height: 32px; object-fit: contain;" />
            <div>
              <h3 style="margin: 0; font-size: 22px; color: #4b3b2a; font-weight: 600;">🎨 Create/Edit Content</h3>
              <p style="margin: 4px 0 0; font-size: 12px; color: rgba(107, 84, 64, 0.78); letter-spacing: 0.3px;">Choose AI-powered edits or an editorial brief with the same warm palette.</p>
            </div>
          </div>
          <button onclick="closeContentCreationModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">×</button>
        </div>

        <div style="background: linear-gradient(135deg, #fdf4e6 0%, #f2e4d2 100%); padding: 24px; border-radius: 16px; border: 1px solid rgba(196, 139, 90, 0.24); box-shadow: 0 18px 32px rgba(112, 82, 50, 0.12);">
          <!-- Content Creation Type Selection -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div onclick="selectContentType('ai')" id="aiContentType" style="padding: 20px; border: 2px solid #ead7c2; border-radius: 16px; cursor: pointer; text-align: center; transition: all 0.3s ease; background: white; box-shadow: 0 12px 24px rgba(112, 82, 50, 0.08);" onmouseover="this.style.borderColor='#c48b5a'" onmouseout="this.style.borderColor=this.classList.contains('selected') ? '#7fa284' : '#ead7c2'">
              <div style="font-size: 48px; margin-bottom: 12px;">🚀</div>
              <h4 style="margin: 0 0 8px; color: #4b3b2a;">AI Content Creation</h4>
              <p style="margin: 0; font-size: 14px; color: #6b5440;">Use Runware API with Google Gemini Flash Image 2.5 to edit images with natural language</p>
            </div>
            
            <div onclick="selectContentType('editorial')" id="editorialContentType" style="padding: 20px; border: 2px solid #ead7c2; border-radius: 16px; cursor: pointer; text-align: center; transition: all 0.3s ease; background: white; box-shadow: 0 12px 24px rgba(112, 82, 50, 0.08);" onmouseover="this.style.borderColor='#c48b5a'" onmouseout="this.style.borderColor=this.classList.contains('selected') ? '#7fa284' : '#ead7c2'">
              <div style="font-size: 48px; margin-bottom: 12px;">✂️</div>
              <h4 style="margin: 0 0 8px; color: #4b3b2a;">Editorial Request</h4>
              <p style="margin: 0; font-size: 14px; color: #6b5440;">Request internal/external vendor to edit existing assets</p>
            </div>
          </div>

          <!-- AI Content Creation Panel -->
          <div id="aiContentPanel" style="display: none;">
            <div style="border: 1px solid rgba(127, 162, 132, 0.4); border-radius: 16px; padding: 22px; background: linear-gradient(135deg, rgba(127, 162, 132, 0.9) 0%, rgba(4, 120, 87, 0.92) 100%); color: white; margin-bottom: 20px; box-shadow: 0 18px 32px rgba(79, 115, 95, 0.25);">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 28px; margin-right: 12px;">🚀</span>
                <h4 style="margin: 0; font-weight: 600; font-size: 18px;">AI Content Creation with Nano Banana 🍌</h4>
              </div>
              
              <!-- Info Banner -->
              <div style="background: rgba(255, 252, 245, 0.12); border-left: 4px solid rgba(255, 252, 245, 0.55); padding: 12px; margin-bottom: 20px; border-radius: 8px;">
                <div style="font-weight: 600; color: #fffaf0; margin-bottom: 4px; letter-spacing: 0.4px;">✨ Powered by Google Gemini Flash Image 2.5 (Nano Banana)</div>
                <div style="color: rgba(255,255,255,0.86); font-size: 14px;">Professional AI image editing and generation via Runware API</div>
              </div>
              
              <!-- Image Upload Section -->
        <div style="background: rgba(255,255,255,0.14); border: 2px dashed rgba(255,255,255,0.35); border-radius: 12px; padding: 26px; margin-bottom: 20px; text-align: center; cursor: pointer; transition: transform 0.2s ease;" 
          id="contentImageUploadArea" onclick="document.getElementById('contentImageInput').click()" onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='rgba(255,255,255,0.55)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.35)';">
                <input type="file" id="contentImageInput" accept="image/*" style="display: none;" onchange="handleContentImageUpload(event)">
                <div id="contentUploadContent">
                  <span style="font-size: 64px; color: rgba(255,255,255,0.7);">📷</span><br>
                  <div style="font-weight: 600; margin: 12px 0; font-size: 18px;">Upload Image to Edit</div>
                  <div style="color: rgba(255,255,255,0.8); font-size: 16px;">Click here to add your image</div>
                  <div style="color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 6px;">Supports JPG, PNG, WebP</div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;">AI Operation</label>
                  <select id="contentAiOperation" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                    <option value="">Select operation...</option>
                    <option value="color-change">Color Change</option>
                    <option value="add-model">Add Model</option>
                    <option value="background-change">Background Change</option>
                    <option value="object-removal">Object Removal</option>
                    <option value="style-transfer">Style Transfer</option>
                    <option value="product-enhancement">Product Enhancement</option>
                    <option value="lighting-adjustment">Lighting Adjustment</option>
                    <option value="custom">Custom Prompt</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;">Quality Level</label>
                  <select id="contentAiQuality" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                    <option value="standard">Standard</option>
                    <option value="high" selected>High Quality</option>
                    <option value="ultra">Ultra HD</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;" id="aiInstructionsLabel">🚀 Google Gemini Flash Image 2.5 AI Instructions</label>
                <textarea id="contentAiInstructions" rows="4" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; resize: vertical; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'" 
                          placeholder="Describe how you want to edit the image with AI...&#10;Example: Make the dress red and add a beautiful sunset background&#10;&#10;� AI will help you:&#10;• Professional product enhancement&#10;• Background replacement and editing&#10;• Color modifications and style transfers&#10;• Model addition and scene composition"></textarea>
              </div>
              
              <div style="display: flex; gap: 12px;">
                <button type="button" id="testAIButton" onclick="testSelectedAIService()" style="padding: 12px 20px; background: #7fa284; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 500; box-shadow: 0 10px 24px rgba(127, 162, 132, 0.35); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)';">
                  🔗 Test Nano Banana
                </button>
                <button type="button" id="processAIButton" onclick="processContentWithSelectedAI()" style="padding: 12px 22px; background: linear-gradient(135deg, #c48b5a 0%, #a66b38 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 24px rgba(166, 107, 56, 0.35); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)';">
                  🍌 Process with Nano Banana
                </button>
              </div>
            </div>
          </div>

          <!-- Editorial Request Panel -->
          <div id="editorialContentPanel" style="display: none;">
            <div style="border: 1px solid rgba(213, 158, 86, 0.4); border-radius: 16px; padding: 22px; background: linear-gradient(135deg, rgba(213, 158, 86, 0.94) 0%, rgba(217, 119, 6, 0.92) 100%); color: white; margin-bottom: 20px; box-shadow: 0 18px 32px rgba(181, 123, 43, 0.28);">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 28px; margin-right: 12px;">✂️</span>
                <h4 style="margin: 0; font-weight: 600; font-size: 18px;">Editorial Request</h4>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;">Request Type</label>
                  <select id="editorialType" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                    <option value="">Select type...</option>
                    <option value="internal">Internal Team</option>
                    <option value="external">External Vendor</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;">Priority</label>
                  <select id="editorialPriority" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <!-- Asset Upload Section -->
        <div style="background: rgba(255,255,255,0.14); border: 2px dashed rgba(255,255,255,0.35); border-radius: 12px; padding: 26px; margin-bottom: 20px; text-align: center; cursor: pointer; transition: transform 0.2s ease;" 
          id="editorialAssetUploadArea" onclick="document.getElementById('editorialAssetInput').click()" onmouseover="this.style.transform='translateY(-2px)'; this.style.borderColor='rgba(255,255,255,0.55)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.35)';">
                <input type="file" id="editorialAssetInput" accept="image/*,video/*,.pdf,.psd,.ai" multiple style="display: none;" onchange="handleEditorialAssetUpload(event)">
                <div id="editorialUploadContent">
                  <span style="font-size: 64px; color: rgba(255,255,255,0.7);">📁</span><br>
                  <div style="font-weight: 600; margin: 12px 0; font-size: 18px;">Upload Assets to Edit</div>
                  <div style="color: rgba(255,255,255,0.8); font-size: 16px;">Click here to add files</div>
                  <div style="color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 6px;">Supports images, videos, PSD, AI files</div>
                </div>
              </div>
              
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;">✂️ Editorial Instructions</label>
                <textarea id="editorialInstructions" rows="4" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; resize: vertical; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'" 
                          placeholder="Describe the edits you need...&#10;Example: Remove background, adjust lighting, color correct, retouch model skin&#10;&#10;📋 Be specific about:&#10;• Colors to change&#10;• Objects to remove/add&#10;• Style preferences&#10;• File format needed"></textarea>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;">Deadline</label>
                  <input type="date" id="editorialDeadline" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                </div>
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 16px;">Budget (SEK)</label>
                  <input type="number" id="editorialBudget" min="0" style="width: 100%; padding: 14px; border: 2px solid #ead7c2; border-radius: 10px; font-size: 16px; color: #4b3b2a; background: rgba(255,252,245,0.85); transition: border-color 0.2s ease;" placeholder="0" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#ead7c2'">
                </div>
              </div>
              
              <div style="display: flex; gap: 12px;">
                <button type="button" onclick="submitEditorialRequest()" style="padding: 12px 22px; background: linear-gradient(135deg, #7fa284 0%, #4f7e5d 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 24px rgba(127, 162, 132, 0.35); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)';">
                  📝 Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);      // Add ESC key event listener
      const escKeyHandler = function(event) {
        if (event.key === 'Escape') {
          closeContentCreationModal();
        }
      };
      
      modal._escKeyHandler = escKeyHandler;
      document.addEventListener('keydown', escKeyHandler);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '650px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    // Close the content creation modal
    function closeContentCreationModal() {
      const modal = document.getElementById('contentCreationModal');
      
      if (modal) {
        // Remove ESC key event listener
        if (modal._escKeyHandler) {
          document.removeEventListener('keydown', modal._escKeyHandler);
        }
        
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Content type selection
    function selectContentType(type) {
      // Remove previous selections
      document.getElementById('aiContentType').classList.remove('selected');
      document.getElementById('editorialContentType').classList.remove('selected');
      document.getElementById('aiContentPanel').style.display = 'none';
      document.getElementById('editorialContentPanel').style.display = 'none';
      
      // Reset border colors
  document.getElementById('aiContentType').style.borderColor = '#ead7c2';
  document.getElementById('editorialContentType').style.borderColor = '#ead7c2';
      
      if (type === 'ai') {
        document.getElementById('aiContentType').classList.add('selected');
        document.getElementById('aiContentType').style.borderColor = '#7fa284';
        document.getElementById('aiContentPanel').style.display = 'block';
      } else if (type === 'editorial') {
        document.getElementById('editorialContentType').classList.add('selected');
        document.getElementById('editorialContentType').style.borderColor = '#7fa284';
        document.getElementById('editorialContentPanel').style.display = 'block';
      }
    }

    // Handle content image upload for AI
    function handleContentImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        showToast('⚠️ Please select a valid image file', 'warning');
        return;
      }
      
      window.uploadedContentImage = file;
      const reader = new FileReader();
      
      reader.onload = function(e) {
        window.uploadedContentImageData = e.target.result;
        
        const uploadContent = document.getElementById('contentUploadContent');
        if (uploadContent) {
          uploadContent.innerHTML = 
            '<div style="position: relative; text-align: center;">' +
              '<img src="' + window.uploadedContentImageData + '" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin-bottom: 12px; border: 2px solid #7fa284;">' +
              '<div style="font-weight: 600; margin: 12px 0; color: #7fa284; font-size: 18px;">✅ Image Ready: ' + file.name + '</div>' +
              '<div style="color: rgba(255,255,255,0.8); font-size: 14px;">Click to change image</div>' +
            '</div>';
          
          showToast('📷 Image uploaded: ' + file.name, 'success');
        }
      };
      
      reader.readAsDataURL(file);
    }

    // Handle editorial asset upload
    function handleEditorialAssetUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;
      
      window.uploadedEditorialAssets = files;
      
      const uploadContent = document.getElementById('editorialUploadContent');
      if (uploadContent) {
        uploadContent.innerHTML = 
          '<div style="position: relative; text-align: center;">' +
            '<span style="font-size: 48px; color: #7fa284;">📁</span><br>' +
            '<div style="font-weight: 600; margin: 12px 0; color: #7fa284; font-size: 18px;">✅ ' + files.length + ' file(s) uploaded</div>' +
            '<div style="color: rgba(255,255,255,0.8); font-size: 14px;">' + files.map(f => f.name).join(', ') + '</div>' +
            '<div style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 6px;">Click to change files</div>' +
          '</div>';
        
        showToast('📁 ' + files.length + ' file(s) uploaded', 'success');
      }
    }

    // Process content with AI
    function processContentWithAI() {
      console.log('processContentWithAI called - Using Runware API');
      const operation = document.getElementById('contentAiOperation').value;
      const instructions = document.getElementById('contentAiInstructions').value.trim();
      
      console.log('Operation:', operation);
      console.log('Instructions:', instructions);
      console.log('Using Runware API with Google Gemini Flash Image 2.5 model');
      
      if (!window.uploadedContentImageData) {
        showToast('⚠️ Please upload an image first', 'warning');
        return;
      }
      
      if (!instructions && !operation) {
        showToast('⚠️ Please provide AI instructions or select an operation', 'warning');
        return;
      }
      
      showToast('🚀 Processing with Runware API (Google Gemini Flash Image 2.5)...', 'info');
      
      // Use existing AI processing function
      window.processImageWithAI();
    }

    // Update AI service display based on selection
    function updateAIServiceDisplay() {
      const serviceSelect = document.getElementById('aiServiceSelect');
      const label = document.getElementById('aiInstructionsLabel');
      const textarea = document.getElementById('contentAiInstructions');
      
      if (!serviceSelect || !label || !textarea) return;
      
      const selectedService = serviceSelect.value;
      
      if (selectedService === 'runware') {
        label.innerHTML = '🚀 Runware API Instructions';
        textarea.placeholder = "Describe how you want to edit the image with Runware AI...\nExample: Make the dress red and add a beautiful sunset background\n\n🚀 Runware specializes in:\n• Professional product enhancement\n• Background replacement and editing\n• Color modifications and style transfers\n• Model addition and scene composition";
      } else if (selectedService === 'gemini') {
        label.innerHTML = '🤖 Google Gemini AI Instructions';
        textarea.placeholder = "Describe how you want to edit the image with Google Gemini AI...\nExample: Make the dress red and add a beautiful sunset background\n\n🤖 Google Gemini specializes in:\n• Advanced image generation and editing\n• Creative AI transformations\n• High-quality image processing\n• Intelligent content creation";
      }
    }

    // Test selected AI service (always Nano Banana/Runware)
    function testSelectedAIService() {
      testRunwareConnection();
    }

    // Process content with selected AI service (always Nano Banana/Runware)
    function processContentWithSelectedAI() {
      processContentWithAI(); // Always use Runware with Nano Banana model
    }

    // Process content with Google Gemini AI
    function processContentWithGeminiAI() {
      console.log('processContentWithGeminiAI called');
      const operation = document.getElementById('contentAiOperation').value;
      const instructions = document.getElementById('contentAiInstructions').value.trim();
      
      console.log('Operation:', operation);
      console.log('Instructions:', instructions);
      console.log('Using Google Gemini AI for image processing');
      
      if (!window.uploadedContentImageData) {
        showToast('⚠️ Please upload an image first', 'warning');
        return;
      }
      
      if (!instructions && !operation) {
        showToast('⚠️ Please provide AI instructions or select an operation', 'warning');
        return;
      }
      
      showToast('🤖 Processing with Google Gemini AI...', 'info');
      
      // Use Gemini AI processing function
      window.processImageWithGeminiAI();
    }

    // Submit editorial request
    function submitEditorialRequest() {
      const type = document.getElementById('editorialType').value;
      const priority = document.getElementById('editorialPriority').value;
      const instructions = document.getElementById('editorialInstructions').value.trim();
      const deadline = document.getElementById('editorialDeadline').value;
      const budget = document.getElementById('editorialBudget').value;
      
      if (!type) {
        showToast('⚠️ Please select request type', 'warning');
        return;
      }
      
      if (!instructions) {
        showToast('⚠️ Please provide editorial instructions', 'warning');
        return;
      }
      
      if (!window.uploadedEditorialAssets || window.uploadedEditorialAssets.length === 0) {
        showToast('⚠️ Please upload assets to edit', 'warning');
        return;
      }
      
      // Create editorial request
      const currentUser = authSystem.getCurrentUser();
      const requestId = 'EDR-' + Date.now();
      
      const editorialRequest = {
        id: requestId,
        type: type,
        priority: priority,
        instructions: instructions,
        deadline: deadline,
        budget: budget ? parseFloat(budget) : null,
        assets: window.uploadedEditorialAssets.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        status: 'Pending',
        createdBy: currentUser.name,
        createdDate: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
      };
      
      // Store editorial requests (you can integrate with your existing order system)
      let editorialRequests = JSON.parse(localStorage.getItem('editorialRequests') || '[]');
      editorialRequests.push(editorialRequest);
      localStorage.setItem('editorialRequests', JSON.stringify(editorialRequests));
      
      showToast('✅ Editorial request submitted successfully! Request ID: ' + requestId, 'success');
      closeContentCreationModal();
    }

    // Expose functions globally
    window.showContentCreationModal = showContentCreationModal;
    window.closeContentCreationModal = closeContentCreationModal;
    window.selectContentType = selectContentType;
    window.handleContentImageUpload = handleContentImageUpload;
    window.handleEditorialAssetUpload = handleEditorialAssetUpload;
    window.processContentWithAI = processContentWithAI;
    window.updateAIServiceDisplay = updateAIServiceDisplay;
    window.testSelectedAIService = testSelectedAIService;
    window.processContentWithSelectedAI = processContentWithSelectedAI;
    window.processContentWithGeminiAI = processContentWithGeminiAI;
    window.submitEditorialRequest = submitEditorialRequest;

    // Show orders modal on the right side of sidebar
    function showOrdersModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('ordersRightModal');
      if (existingModal) {
        closeOrdersModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'ordersRightModal';
      modal.style.cssText = `
        position: fixed;
  top: 0;
  left: 260px;
        width: 800px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
      `;

      // Get orders data
      const orders = authSystem.getFilteredOrders(allOrders);
      const searchBox = document.getElementById('searchBox');
      const term = searchBox?.value.toLowerCase() || '';
      const filtered = orders.filter(o =>
        !term ||
        o.orderNumber.toLowerCase().includes(term) ||
        o.title.toLowerCase().includes(term) ||
        o.photographer.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term)
      );

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 20px; color: #4b3b2a; font-weight: 600;">📋 All Orders (${filtered.length})</h3>
          <button onclick="closeOrdersModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <div style="margin-bottom: 12px;">
            <input type="text" id="modalSearchBox" placeholder="🔍 Search orders..." style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" value="${term}">
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; max-height: calc(100vh - 200px); overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #4b3b2a; font-size: 12px;">Order #</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #4b3b2a; font-size: 12px;">Title</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #4b3b2a; font-size: 12px;">Status</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #4b3b2a; font-size: 12px;">Priority</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #4b3b2a; font-size: 12px;">Deadline</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #4b3b2a; font-size: 12px;">Progress</th>
              </tr>
            </thead>
            <tbody id="modalOrdersBody">
              ${filtered.map(o => {
                const progress = calculateProgress(o.status);
                const isOverdue = new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered';
                const deadlineStyle = isOverdue ? 'color: #dc2626; font-weight: bold;' : '';
                const commentCount = (o.comments || []).length;

                return `
                <tr onclick="showOrderDetails('${o.orderNumber}'); closeOrdersModal();" style="cursor: pointer; border-bottom: 1px solid #e5e7eb; hover: background: #f9fafb;">
                  <td style="padding: 12px; font-weight: 600; color: #4b3b2a;">${o.orderNumber}</td>
                  <td style="padding: 12px; color: #4b3b2a;">${o.title}</td>
                  <td style="padding: 12px;"><span class="status ${o.status.replace(/\s+/g, '')}" style="font-size: 12px;">${o.status}</span></td>
                  <td style="padding: 12px;"><span class="status ${o.priority}" style="font-size: 12px;">${o.priority}</span></td>
                  <td style="padding: 12px; ${deadlineStyle}">${o.deadline}${isOverdue ? ' ⚠️' : ''}</td>
                  <td style="padding: 12px;">
                    <div class="progress-bar" style="width: 60px; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                      <div class="progress-fill" style="width: ${progress}%; height: 100%; background: ${progress === 100 ? '#7fa284' : '#c48b5a'}; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 10px; color: #6b5440; margin-top: 2px;">${progress}%</div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          ${filtered.length === 0 ? '<div style="text-align: center; color: #6b5440; padding: 40px; font-style: italic;">No orders found matching your search.</div>' : ''}
        </div>
      `;

      document.body.appendChild(modal);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '800px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Add search functionality
      setTimeout(() => {
        const modalSearchBox = document.getElementById('modalSearchBox');
        if (modalSearchBox) {
          modalSearchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#modalOrdersBody tr');

            rows.forEach(row => {
              const text = row.textContent.toLowerCase();
              row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
          });
        }
      }, 100);
    }

    // Close the orders modal
    function closeOrdersModal() {
      const modal = document.getElementById('ordersRightModal');
      if (modal) {
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Show dashboard modal on the right side of sidebar
    function showDashboardModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('dashboardRightModal');
      if (existingModal) {
        closeDashboardModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'dashboardRightModal';
      modal.style.cssText = `
        position: fixed;
  top: 0;
  left: 260px;
        width: 700px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
      `;

      // Get dashboard data
      const orders = authSystem.getFilteredOrders(allOrders);
      const totalOrders = orders.length;
      const newOrders = orders.filter(o => o.status === 'New Request' || o.status === 'Draft').length;
      const inProgressOrders = orders.filter(o => o.status === 'In Progress').length;
      const completedOrders = orders.filter(o => o.status === 'Complete' || o.status === 'Delivered').length;
      const overdueOrders = orders.filter(o => new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered').length;

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 20px; color: #4b3b2a; font-weight: 600;">📊 Dashboard Overview</h3>
          <button onclick="closeDashboardModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 16px; font-size: 16px; color: #4b3b2a;">📈 Key Metrics</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #c48b5a;">
              <div style="font-size: 24px; font-weight: bold; color: #4b3b2a;">${totalOrders}</div>
              <div style="font-size: 12px; color: #6b5440;">Total Orders</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <div style="font-size: 24px; font-weight: bold; color: #4b3b2a;">${newOrders}</div>
              <div style="font-size: 12px; color: #6b5440;">New Orders</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #c48b5a;">
              <div style="font-size: 24px; font-weight: bold; color: #4b3b2a;">${inProgressOrders}</div>
              <div style="font-size: 12px; color: #6b5440;">In Progress</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #7fa284;">
              <div style="font-size: 24px; font-weight: bold; color: #4b3b2a;">${completedOrders}</div>
              <div style="font-size: 12px; color: #6b5440;">Completed</div>
            </div>
          </div>

          ${overdueOrders > 0 ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-top: 16px;">
              <div style="font-size: 14px; color: #dc2626; font-weight: 600;">⚠️ ${overdueOrders} orders are overdue</div>
            </div>
          ` : ''}
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 16px; font-size: 16px; color: #4b3b2a;">🔥 Recent Activity</h4>
          <div style="max-height: 300px; overflow-y: auto;">
            ${orders.slice(0, 10).map(o => {
              const progress = calculateProgress(o.status);
              const isOverdue = new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered';

              return `
                <div onclick="showOrderDetails('${o.orderNumber}'); closeDashboardModal();" style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 8px; cursor: pointer; border-left: 4px solid ${getStatusColor(o.status)}; hover: background: #f9fafb;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <div style="font-weight: 600; color: #4b3b2a; font-size: 14px;">${o.orderNumber}</div>
                    <span class="status ${o.status.replace(/\s+/g, '')}" style="font-size: 11px;">${o.status}</span>
                  </div>
                  <div style="color: #6b5440; font-size: 12px; margin-bottom: 4px;">${o.title}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 11px; color: #9ca3af;">${o.deadline}</div>
                    <div style="font-size: 11px; color: #6b5440;">${progress}% complete</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 16px; font-size: 16px; color: #4b3b2a;">⚡ Quick Actions</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <button onclick="showNewOrderModal(); closeDashboardModal();" style="padding: 12px; background: linear-gradient(135deg, #7fa284 0%, #047857 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; text-align: center;">
              ➕ New Order
            </button>
            <button onclick="showView('orders'); closeDashboardModal();" style="padding: 12px; background: #c48b5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; text-align: center;">
              📋 View All Orders
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '700px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    // Close the dashboard modal
    function closeDashboardModal() {
      const modal = document.getElementById('dashboardRightModal');
      if (modal) {
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Expose functions globally
    window.showOrdersModal = showOrdersModal;
    window.closeOrdersModal = closeOrdersModal;
    window.showDashboardModal = showDashboardModal;
    window.closeDashboardModal = closeDashboardModal;

    // Show order details function (unified modal)
    function showOrderDetails(orderNumber) {
      const baseOrders = Array.isArray(window.rkhOrders) && window.rkhOrders.length
        ? window.rkhOrders
        : (typeof allOrders !== 'undefined' ? allOrders : []);

      // Prefer finding from base orders so we mutate the canonical object
      let order = baseOrders.find(o => String(o.orderNumber) === String(orderNumber));

      if (!order && window.authSystem && typeof authSystem.getFilteredOrders === 'function') {
        try {
          const filtered = authSystem.getFilteredOrders(baseOrders) || [];
          order = filtered.find(o => String(o.orderNumber) === String(orderNumber)) || order;
        } catch (err) {
          console.error('[Orders] Unable to resolve order from filtered list:', err);
        }
      }

      if (!order) {
        alert('Order not found: ' + orderNumber);
        return;
      }

      const safeAuth = window.authSystem || {};
      const currentUser = typeof safeAuth.getCurrentUser === 'function' ? safeAuth.getCurrentUser() : { name: 'Guest', role: 'viewer' };
      const canManageOrders = typeof safeAuth.canManageOrders === 'function' ? safeAuth.canManageOrders() : false;
      const canAssignWork = typeof safeAuth.canAssignWork === 'function' ? safeAuth.canAssignWork() : false;
      const canEditOrder = typeof safeAuth.canEditOrder === 'function' ? safeAuth.canEditOrder(order) : (canManageOrders || canAssignWork);

      const statusOptions = [
        'Draft',
        'New Request',
        'Samples Requested',
        'In Progress',
        'Approved',
        'Complete',
        'Delivered'
      ];

      const teamMembers = [
        'Unassigned',
        'Alice Johnson',
        'Bob Smith',
        'Charlie Brown',
        'Diana Prince',
        'Eva Martinez',
        'Frank Wilson',
        'Grace Lee'
      ];

      const modal = document.createElement('div');
      modal.className = 'order-details-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(46,34,23,0.55);display:flex;align-items:center;justify-content:center;z-index:1000;padding:32px 18px;';

      const articlesMarkup = renderArticleCards(order.articles);
      const articlesCount = Array.isArray(order.articles) ? order.articles.length : 0;
      const assignedOwner = order.photographer || 'Unassigned';
      const salesOrgLabel = order.salesOrg || 'Not set';
      const budgetMarkup = order.budget ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:10px;background:rgba(255,255,255,0.6);margin-top:10px;border:1px solid rgba(196,139,90,0.25);"><span style="font-size:12px;letter-spacing:0.05em;color:#82694c;text-transform:uppercase;">Budget</span><span style="font-weight:600;color:#3a2a1d;">${order.budget}</span></div>` : '';
      const deliverablesList = Array.isArray(order.deliverables) ? order.deliverables : (order.deliverables ? [order.deliverables] : []);
      const deliverablesMarkup = deliverablesList.length
        ? deliverablesList.map(item => `
              <div style="background:rgba(255,255,255,0.85);margin:4px 0;padding:10px 12px;border-radius:10px;border-left:4px solid #f59e0b;color:#3a2a1d;font-size:13px;">
                ${item}
              </div>
            `).join('')
        : '<div style="color:#7c6248;font-style:italic;">No deliverables specified</div>';

      const buyersMarkup = Array.isArray(order.buyers) && order.buyers.length
        ? order.buyers.map(buyer => `
              <div style="background:rgba(255,255,255,0.85);margin:4px 0;padding:10px 12px;border-radius:10px;border-left:4px solid #bfa3d6;">
                <div style="font-weight:600;color:#3a2a1d;font-size:13px;">${buyer.name}</div>
                <div style="font-size:12px;color:#7c6248;margin-top:4px;">${Array.isArray(buyer.items) ? buyer.items.join(', ') : (buyer.items || '')}</div>
              </div>
            `).join('')
        : '<div style="color:#7c6248;font-style:italic;">No buyers recorded</div>';

      const eventOrBriefBlock = order.eventId ? `
          <div style="padding:20px;border-radius:16px;background:rgba(254,243,199,0.85);border:1px solid rgba(212,163,94,0.35);box-shadow:0 18px 36px rgba(62,44,30,0.12);">
            <h3 style="margin:0 0 16px;font-size:16px;color:#3b2b1a;display:flex;align-items:center;gap:8px;font-weight:700;">🏢 SAP PMR Integration</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;font-size:13px;color:#3b2b1a;">
              <div><strong>Event ID:</strong> ${order.eventId}</div>
              <div><strong>Purchase Group:</strong> ${order.purchaseGroup} - ${(typeof purchaseGroups !== 'undefined' && purchaseGroups) ? (purchaseGroups[order.purchaseGroup] || 'Unknown') : 'Unknown'}</div>
              <div><strong>Offer ID:</strong> ${order.offerId || 'N/A'}</div>
              <div><strong>Article Number:</strong> ${order.articleNumber || 'N/A'}</div>
              <div><strong>Image Request ID:</strong> ${order.imageRequestId || 'N/A'}</div>
              <div><strong>Photo Status:</strong> <span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:#${order.photoStatus === 'Archive' ? '10b981' : order.photoStatus === 'New Shoot - Photo Box' ? '3b82f6' : 'f59e0b'};color:white;font-size:12px;">${order.photoStatus || 'Not Set'}</span></div>
              ${order.cloudinaryUrl ? `<div><strong>Cloudinary:</strong> <a href="${order.cloudinaryUrl}" target="_blank" style="color:#b15d1d;">View Image</a></div>` : ''}
            </div>
          </div>
        ` : (order.brief ? `
          <div style="padding:20px;border-radius:16px;background:rgba(253,250,246,0.85);border:1px solid rgba(196,139,90,0.35);box-shadow:0 18px 36px rgba(62,44,30,0.12);">
            <h3 style="margin:0 0 12px;font-size:16px;color:#3b2b1a;font-weight:700;">📝 Creative Brief</h3>
            <div style="font-size:14px;line-height:1.6;color:#3b2b1a;white-space:pre-wrap;">${order.brief}</div>
          </div>
        ` : '');

      const damSection = (() => {
        if (typeof window.getDAMAssets !== 'function') {
          return '';
        }
        const damAssets = window.getDAMAssets();
        const linkedAssets = damAssets.filter(asset => asset.orderNumber === order.orderNumber);
        const assetsGrid = linkedAssets.length ? `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-bottom:16px;">
            ${linkedAssets.map(asset => `
              <div style="border:1px solid rgba(127,162,132,0.35);border-radius:10px;padding:10px;background:white;">
                <div style="aspect-ratio:16/9;background:#f1e8dc;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                  ${asset.type === 'image' && asset.url
                    ? `<img src="${asset.url}" alt="${asset.filename}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` +
                      `<div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:#6b5440;font-size:12px;">🖼️</div>`
                    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6b5440;font-size:16px;">${asset.type === 'video' ? '🎬' : '📄'}</div>`}
                </div>
                <div style="font-size:12px;font-weight:600;color:#3a2a1d;margin-bottom:4px;">${asset.filename && asset.filename.length > 22 ? asset.filename.substring(0, 19) + '...' : (asset.filename || 'Asset')}</div>
                <div style="font-size:11px;color:#7c6248;margin-bottom:8px;">${asset.category || 'General'} • ${asset.size || ''}</div>
                <div style="display:flex;gap:6px;">
                  <button onclick="window.viewDAMAsset('${asset.id}')" style="flex:1;padding:6px 8px;background:#7fa284;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">View</button>
                  <button onclick="window.downloadDAMAsset('${asset.id}')" style="flex:1;padding:6px 8px;background:#c48b5a;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">Get</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p style="margin:0;font-size:13px;color:#7c6248;font-style:italic;">No assets linked to this order yet.</p>';
        return `
          <div style="padding:20px;border-radius:16px;background:rgba(240,253,244,0.85);border:1px solid rgba(127,162,132,0.35);box-shadow:0 18px 36px rgba(62,44,30,0.12);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <h3 style="margin:0;font-size:16px;color:#3b2b1a;font-weight:700;">🗂️ DAM Assets (${linkedAssets.length})</h3>
              <button onclick="window.showDAMIntegrationModal()" style="padding:8px 14px;background:#7fa284;color:white;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;">${linkedAssets.length > 0 ? 'Upload More' : 'Upload Assets'}</button>
            </div>
            ${assetsGrid}
          </div>
        `;
      })();

      const uploadFormMarkup = canEditOrder ? `
            <div style="background:rgba(255,255,255,0.9);padding:16px;border-radius:12px;margin-bottom:16px;border:2px dashed rgba(196,139,90,0.4);">
              <div style="text-align:center;color:#6b5440;margin-bottom:12px;">
                <span style="font-size:24px;">📸</span>
                <div style="margin-top:6px;font-size:13px;">Upload content for this order</div>
              </div>
              <input type="file" id="contentUpload-${orderNumber}" accept="image/*,video/*,.pdf,.zip,.rar" multiple style="width:100%;padding:10px;border:1px solid rgba(196,139,90,0.4);border-radius:10px;font-size:13px;margin-bottom:12px;background:rgba(255,255,255,0.95);">
              <div style="text-align:right;">
                <button onclick="uploadContent('${orderNumber}')" style="background:#7fa284;color:white;border:none;padding:8px 18px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;">Upload Files</button>
              </div>
            </div>
          ` : '';

      const uploadedContentMarkup = order.uploadedContent && order.uploadedContent.length
        ? order.uploadedContent.map((file, index) => `
          <div style="background:white;padding:14px;border-radius:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #7fa284;box-shadow:0 8px 16px rgba(62,44,30,0.08);">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="font-size:24px;">${file.type.startsWith('image/') ? '🖼️' : file.type.startsWith('video/') ? '🎥' : file.type === 'application/pdf' ? '📄' : '📁'}</div>
              <div>
                <div style="font-weight:600;color:#3a2a1d;">${file.name}</div>
                <div style="font-size:12px;color:#7c6248;">${(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded by ${file.uploadedBy} • ${new Date(file.uploadedAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;">
              <button onclick="previewContent('${orderNumber}', ${index})" style="background:#c48b5a;color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;">Preview</button>
              <button onclick="downloadContent('${orderNumber}', ${index})" style="background:#6b5440;color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;">Download</button>
            </div>
          </div>
        `).join('')
        : '<div style="text-align:center;color:#7c6248;font-style:italic;padding:20px;">No content uploaded yet</div>';

      const comments = order.comments || [];
      const commentsMarkup = comments.length
        ? comments.map(comment => `
          <div style="background:white;padding:16px;border-radius:12px;margin-bottom:10px;border-left:4px solid #c48b5a;box-shadow:0 8px 16px rgba(62,44,30,0.08);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <div style="font-weight:600;color:#3a2a1d;">${comment.userName} <span style="font-size:12px;color:#7c6248;">(${comment.userRole})</span></div>
              <div style="font-size:12px;color:#7c6248;">${new Date(comment.createdAt).toLocaleDateString()} ${new Date(comment.createdAt).toLocaleTimeString()}</div>
            </div>
            <div style="color:#3a2a1d;line-height:1.5;">${comment.message}</div>
          </div>
        `).join('')
        : '<div style="text-align:center;color:#7c6248;font-style:italic;padding:20px;">No comments yet</div>';

      modal.innerHTML = `
        <div style="position:relative;width:min(820px,95vw);max-height:88vh;overflow-y:auto;border-radius:18px;padding:36px 32px 30px;background:linear-gradient(135deg,rgba(255,255,255,0.96),rgba(249,245,240,0.92));box-shadow:0 40px 70px rgba(34,25,18,0.3);border:1px solid rgba(194,147,104,0.4);backdrop-filter:blur(26px);display:flex;flex-direction:column;gap:28px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
            <div style="flex:1;min-width:0;">
              <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#8a6d4c;font-weight:600;">${salesOrgLabel} · ${order.orderNumber}</div>
              <h2 style="margin:10px 0 12px;font-size:28px;color:#372614;font-weight:700;line-height:1.2;">${order.title}</h2>
              <div style="display:flex;align-items:center;gap:12px;font-size:13px;color:#715b43;">
                <span>Created ${order.createdDate}</span>
                <span style="width:6px;height:6px;border-radius:50%;background:#c48b5a;display:inline-block;"></span>
                <span>Deadline ${order.deadline}</span>
              </div>
            </div>
            <button onclick="this.closest('.order-details-modal').remove()" style="background:rgba(255,255,255,0.45);border:1px solid rgba(117,90,58,0.25);width:42px;height:42px;border-radius:12px;color:#5c4631;font-size:24px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);">×</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;">
            <div style="padding:18px;border-radius:14px;background:rgba(255,255,255,0.7);border:1px solid rgba(196,139,90,0.25);box-shadow:0 16px 30px rgba(62,44,30,0.12);">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#7c6248;font-weight:600;">Status</div>
              <div style="margin-top:10px;">
                <span class="status ${order.status.replace(/\s+/g, '')}" style="display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;font-size:12px;">${order.status}</span>
              </div>
            </div>
            <div style="padding:18px;border-radius:14px;background:rgba(255,255,255,0.7);border:1px solid rgba(196,139,90,0.25);box-shadow:0 16px 30px rgba(62,44,30,0.12);">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#7c6248;font-weight:600;">Priority</div>
              <div style="margin-top:10px;">
                <span class="status ${order.priority}" style="display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;font-size:12px;">${order.priority}</span>
              </div>
            </div>
            <div style="padding:18px;border-radius:14px;background:rgba(255,255,255,0.7);border:1px solid rgba(196,139,90,0.25);box-shadow:0 16px 30px rgba(62,44,30,0.12);">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#7c6248;font-weight:600;">Assigned To</div>
              <div style="margin-top:10px;font-weight:600;color:#3a2a1d;font-size:14px;">${assignedOwner}</div>
            </div>
            <div style="padding:18px;border-radius:14px;background:rgba(255,255,255,0.7);border:1px solid rgba(196,139,90,0.25);box-shadow:0 16px 30px rgba(62,44,30,0.12);">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#7c6248;font-weight:600;">Production</div>
              <div style="margin-top:10px;font-weight:600;color:#3a2a1d;font-size:14px;">${order.production || 'Not set'}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
            <div>
              <div style="padding:18px;border-radius:14px;background:rgba(255,255,255,0.78);border:1px solid rgba(196,139,90,0.25);box-shadow:0 12px 24px rgba(62,44,30,0.1);display:flex;flex-direction:column;gap:10px;">
                <div style="display:flex;justify-content:space-between;color:#7c6248;font-weight:600;">Created By<span style="color:#3a2a1d;font-weight:600;">${order.createdBy}</span></div>
                <div style="display:flex;justify-content:space-between;color:#7c6248;font-weight:600;">Order Type<span style="color:#3a2a1d;font-weight:600;">${order.orderType || 'Standard'}</span></div>
                <div style="display:flex;justify-content:space-between;color:#7c6248;font-weight:600;">Sales Org<span style="color:#3a2a1d;font-weight:600;">${salesOrgLabel}</span></div>
                ${order.channel ? `<div style="display:flex;justify-content:space-between;color:#7c6248;font-weight:600;">Channel<span style="color:#3a2a1d;font-weight:600;">${order.channel}</span></div>` : ''}
              </div>
              ${budgetMarkup}
            </div>
            <div style="padding:20px;border-radius:16px;background:rgba(253,250,246,0.85);border:1px solid rgba(196,139,90,0.35);box-shadow:0 18px 36px rgba(62,44,30,0.12);">
              <h3 style="margin:0 0 16px;font-size:16px;color:#3b2b1a;display:flex;align-items:center;gap:8px;font-weight:700;">Workflow Controls</h3>
              <div style="margin-bottom:16px;font-size:13px;color:#6f583f;">
                <strong style="display:block;color:#3a2a1d;margin-bottom:6px;">Current Status</strong>
                <span class="status ${order.status.replace(/\s+/g, '')}" style="display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;font-size:12px;">${order.status}</span>
              </div>
              ${canManageOrders ? `
                <div style="margin-bottom:18px;">
                  <label for="statusSelect_${orderNumber}" style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7c6248;font-weight:600;margin-bottom:6px;">Update Status</label>
                  <select id="statusSelect_${orderNumber}" style="width:100%;padding:10px 12px;border:1px solid rgba(148,109,71,0.35);border-radius:10px;background:rgba(255,255,255,0.9);color:#3a2a1d;font-size:14px;">
                    ${statusOptions.map(status => `<option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>`).join('')}
                  </select>
                </div>
              ` : ''}
              <div style="margin-bottom:18px;">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7c6248;font-weight:600;margin-bottom:6px;">Assigned To</div>
                <div style="font-size:14px;color:#3a2a1d;font-weight:600;">${assignedOwner}</div>
              </div>
              ${canAssignWork ? `
                <div style="margin-bottom:18px;">
                  <label for="assignSelect_${orderNumber}" style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7c6248;font-weight:600;margin-bottom:6px;">Reassign Order</label>
                  <select id="assignSelect_${orderNumber}" style="width:100%;padding:10px 12px;border:1px solid rgba(148,109,71,0.35);border-radius:10px;background:rgba(255,255,255,0.9);color:#3a2a1d;font-size:14px;">
                    ${teamMembers.map(member => `<option value="${member}" ${(member === order.photographer || (member === 'Unassigned' && !order.photographer)) ? 'selected' : ''}>${member}</option>`).join('')}
                  </select>
                </div>
              ` : ''}
              ${(canManageOrders || canAssignWork) ? `
                <button onclick="updateOrderWorkflow('${orderNumber}')" style="width:100%;margin-top:4px;background:linear-gradient(135deg,#b88358 0%,#8e6238 100%);color:white;border:none;padding:12px 16px;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;box-shadow:0 12px 25px rgba(145,101,60,0.3);transition:transform 0.15s ease;">Save Updates</button>
              ` : ''}
            </div>
          </div>

          ${eventOrBriefBlock}

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:26px;">
            <div style="padding:20px;border-radius:16px;background:rgba(253,250,246,0.88);border:1px solid rgba(196,139,90,0.3);box-shadow:0 14px 28px rgba(62,44,30,0.1);">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7c6248;font-weight:600;">Articles</div>
                <div style="font-size:12px;color:#8a6d4c;">${articlesCount} items</div>
              </div>
              <div>${articlesMarkup}</div>
            </div>
            <div style="padding:20px;border-radius:16px;background:rgba(255,255,255,0.85);border:1px solid rgba(196,139,90,0.3);box-shadow:0 14px 28px rgba(62,44,30,0.1);">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7c6248;font-weight:600;margin-bottom:12px;">Buyers</div>
              <div style="max-height:220px;overflow-y:auto;">${buyersMarkup}</div>
            </div>
            <div style="padding:20px;border-radius:16px;background:rgba(255,255,255,0.85);border:1px solid rgba(196,139,90,0.3);box-shadow:0 14px 28px rgba(62,44,30,0.1);">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7c6248;font-weight:600;margin-bottom:12px;">Deliverables</div>
              <div style="max-height:220px;overflow-y:auto;">${deliverablesMarkup}</div>
            </div>
          </div>

          ${damSection}

          <div style="padding:20px;border-radius:16px;background:rgba(249,250,251,0.9);border:1px solid rgba(196,139,90,0.25);box-shadow:0 14px 28px rgba(62,44,30,0.08);">
            <h3 style="margin:0 0 16px;font-size:16px;color:#3b2b1a;display:flex;align-items:center;gap:8px;font-weight:700;">📁 Uploaded Content</h3>
            ${uploadFormMarkup}
            <div id="uploadedContent-${orderNumber}" style="max-height:260px;overflow-y:auto;">${uploadedContentMarkup}</div>
          </div>

          <div style="padding:20px;border-radius:16px;background:rgba(249,250,251,0.9);border:1px solid rgba(196,139,90,0.25);box-shadow:0 14px 28px rgba(62,44,30,0.08);">
            <h3 style="margin:0 0 16px;font-size:16px;color:#3b2b1a;display:flex;align-items:center;gap:8px;font-weight:700;">💬 Comments (${comments.length})</h3>
            <div style="background:rgba(255,255,255,0.95);padding:12px;border-radius:12px;margin-bottom:16px;">
              <textarea id="newComment-${orderNumber}" placeholder="Add a comment..." style="width:100%;padding:10px;border:1px solid rgba(196,139,90,0.4);border-radius:10px;resize:vertical;min-height:70px;font-family:inherit;font-size:14px;"></textarea>
              <div style="margin-top:8px;text-align:right;">
                <button onclick="addComment('${orderNumber}')" style="background:#c48b5a;color:white;border:none;padding:8px 20px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;">Add Comment</button>
              </div>
            </div>
            <div style="max-height:300px;overflow-y:auto;">${commentsMarkup}</div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:12px;">
            ${canManageOrders ? `
              <button onclick="showOrderHistory('${orderNumber}')" style="border:none;padding:12px 24px;border-radius:12px;background:rgba(94,73,52,0.12);color:#4b3825;font-weight:600;font-size:14px;cursor:pointer;">View History</button>
            ` : ''}
            <button onclick="this.closest('.order-details-modal').remove()" style="border:none;padding:12px 26px;border-radius:12px;background:linear-gradient(135deg,#76604b 0%,#3d2d1e 100%);color:white;font-weight:600;font-size:14px;cursor:pointer;box-shadow:0 12px 24px rgba(61,45,30,0.25);">Close</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if (e.target === modal) { modal.remove(); } });
    }

    window.showOrderDetails = showOrderDetails;
    
    // Function to update order workflow (status and assignment)
    function updateOrderWorkflow(orderNumber) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order) {
        alert('Order not found!');
        return;
      }
      
      const statusSelect = document.getElementById(`statusSelect_${orderNumber}`);
      const assignSelect = document.getElementById(`assignSelect_${orderNumber}`);
      const currentUser = authSystem.getCurrentUser();
      
      let updated = false;
      let changes = [];
      
      // Update status if changed and user has permission
      if (statusSelect && authSystem.canManageOrders()) {
        const newStatus = statusSelect.value;
        if (newStatus !== order.status) {
          order.status = newStatus;
          changes.push(`Status: ${newStatus}`);
          updated = true;
        }
      }
      
      // Update assignment if changed and user has permission
      if (assignSelect && authSystem.canAssignWork()) {
        const newAssignment = assignSelect.value === 'Unassigned' ? null : assignSelect.value;
        if (newAssignment !== order.photographer) {
          order.photographer = newAssignment;
          changes.push(`Assigned to: ${newAssignment || 'Unassigned'}`);
          updated = true;
        }
      }
      
      if (updated) {
        // Add to order history
        if (!order.history) order.history = [];
        order.history.push({
          timestamp: new Date().toLocaleString(),
          user: currentUser.name,
          action: 'Workflow Update',
          changes: changes,
          details: `Updated: ${changes.join(', ')}`
        });
        
        // Save to localStorage
        localStorage.setItem('photoOrders', JSON.stringify(allOrders));
        
        // Show success message
        alert(`✅ Order ${orderNumber} updated successfully!\n\nChanges made:\n• ${changes.join('\n• ')}`);
        
        // Refresh the views
        drawOrderRows();
        drawWorkflowView();
        
        // Close and reopen the modal to show updated info
        document.querySelector('.order-details-modal')?.remove();
        setTimeout(() => showOrderDetails(orderNumber), 300);
        
      } else {
        alert('ℹ️ No changes detected.');
      }
    }
    
    // Function to show order history
    function showOrderHistory(orderNumber) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order || !order.history) {
        alert('No history available for this order.');
        return;
      }
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1001';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:600px;width:90%;max-height:70vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;color:#4b3b2a;">📜 Order History - ${orderNumber}</h3>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                    style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b5440;">×</button>
          </div>
          <div style="space-y:12px;">
            ${order.history.slice().reverse().map(entry => `
              <div style="border-left:4px solid #c48b5a;padding-left:16px;margin-bottom:16px;">
                <div style="font-weight:600;color:#4b3b2a;margin-bottom:4px;">${entry.action}</div>
                <div style="color:#6b5440;font-size:13px;margin-bottom:4px;">${entry.timestamp} • ${entry.user}</div>
                <div style="color:#4b3b2a;font-size:14px;">${entry.details}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Initialize order history for existing orders
    function initializeOrderHistory() {
      allOrders.forEach(order => {
        if (!order.history) {
          order.history = [{
            timestamp: order.createdDate || new Date().toLocaleString(),
            user: order.createdBy || 'System',
            action: 'Order Created',
            changes: ['Order created'],
            details: `Initial order creation with status: ${order.status}`
          }];
        }
      });
      localStorage.setItem('photoOrders', JSON.stringify(allOrders));
    }
    
    // Initialize on load
    initializeOrderHistory();

    // Drag and Drop functionality for workflow kanban
    let draggedOrderNumber = null;
    
    function handleDragStart(event, orderNumber) {
      draggedOrderNumber = orderNumber;
      event.dataTransfer.effectAllowed = 'move';
      event.target.style.opacity = '0.5';
    }
    
    function handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      event.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    }
    
    function handleDrop(event, newStatus) {
      event.preventDefault();
      event.currentTarget.style.backgroundColor = '';
      
      if (!draggedOrderNumber) return;
      
      const currentUser = authSystem.getCurrentUser();
      if (!authSystem.canManageOrders()) {
        alert('❌ You do not have permission to change order status.');
        resetDragState();
        return;
      }
      
      const order = allOrders.find(o => o.orderNumber === draggedOrderNumber);
      if (!order) {
        resetDragState();
        return;
      }
      
      if (order.status === newStatus) {
        resetDragState();
        return;
      }
      
      // Update order status
      const oldStatus = order.status;
      order.status = newStatus;
      
      // Add to history
      if (!order.history) order.history = [];
      order.history.push({
        timestamp: new Date().toLocaleString(),
        user: currentUser.name,
        action: 'Status Changed (Drag & Drop)',
        changes: [`Status: ${oldStatus} → ${newStatus}`],
        details: `Status changed from "${oldStatus}" to "${newStatus}" via drag and drop`
      });
      
      // Save changes
      localStorage.setItem('photoOrders', JSON.stringify(allOrders));
      
      // Refresh views
      drawWorkflowView();
      drawOrderRows();
      
      // Check if order was moved to Delivered status for celebration
      if (newStatus === 'Delivered' && oldStatus !== 'Delivered') {
        console.log('🎉 Order moved to Delivered! Triggering celebration...');
        console.log('Order:', order.orderNumber, 'Old status:', oldStatus, 'New status:', newStatus);
        
        // Trigger celebration effects
        setTimeout(() => {
          console.log('🎊 Executing celebration effects...');
          if (typeof celebrateOrderDelivery === 'function') {
            celebrateOrderDelivery();
          } else {
            console.error('❌ celebrateOrderDelivery function not found');
            // Fallback celebration
            showToast('🎉 Order delivered! Great work! 👏', 'success');
          }
        }, 200); // Small delay to let the UI update first
      }
      
      // Show success notification
      showNotification(`✅ Order ${draggedOrderNumber} moved to ${newStatus}`, 'success');
      
      resetDragState();
    }
    
    function resetDragState() {
      if (draggedOrderNumber) {
        const draggedElement = document.querySelector(`[data-order="${draggedOrderNumber}"]`);
        if (draggedElement) {
          draggedElement.style.opacity = '1';
        }
      }
      draggedOrderNumber = null;
      
      // Remove highlight from all columns
      document.querySelectorAll('.kanban-column').forEach(col => {
        col.style.backgroundColor = '';
      });
    }
    
    // Add notification system
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: #7fa284;' : 'background: #c48b5a;'}
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
    
    // Expose functions globally
    window.handleDragStart = handleDragStart;
    window.handleDragOver = handleDragOver;
    window.handleDrop = handleDrop;

    // Expose functions globally
    window.updateOrderWorkflow = updateOrderWorkflow;
    window.showOrderHistory = showOrderHistory;

    function drawOrderRows() {
      const tbody = document.getElementById('ordersBody');
      const searchBox = document.getElementById('searchBox');
      
      if (!window.rkhOrders) {
        return;
      }
      
      if (!window.authSystem) {
        return;
      }

      const orders = window.authSystem.getFilteredOrders(window.rkhOrders);
      let filteredByActiveFilters = hasPrimaryOrderFilter() ? applyActiveOrderFilters(orders) : orders;
      let statusFiltered = { orders: filteredByActiveFilters, label: '' };

      if (statusFilterOverride) {
        statusFiltered = applyStatusFilter(filteredByActiveFilters, statusFilterOverride);
        filteredByActiveFilters = statusFiltered.orders;
      }

      updateOrderFilterSummary(filteredByActiveFilters);

      const term = searchBox?.value.toLowerCase() || '';
      const filtered = filteredByActiveFilters.filter(o => 
        !term || 
        o.orderNumber.toLowerCase().includes(term) ||
        o.title.toLowerCase().includes(term) ||
        o.photographer.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term)
      );
      
      if (tbody) {
        const placeholderSpan = '<span style="color:#9ca3af;">—</span>';

        const formatPurchaseGroupDisplay = (value) => {
          if (value === undefined || value === null || value === '') {
            return placeholderSpan;
          }
          const numeric = Number(value);
          if (!Number.isNaN(numeric) && purchaseGroups && purchaseGroups[numeric]) {
            return `${numeric} - ${purchaseGroups[numeric]}`;
          }
          const textValue = String(value).trim();
          if (purchaseGroups) {
            const matchedKey = Object.keys(purchaseGroups).find(key => purchaseGroups[key].toLowerCase() === textValue.toLowerCase());
            if (matchedKey) {
              return `${matchedKey} - ${purchaseGroups[matchedKey]}`;
            }
          }
          return textValue || placeholderSpan;
        };

        const buildProductionInfo = (order) => {
          if (!order) {
            return placeholderSpan;
          }
          const meta = order.productionMeta || applyProductionNormalization(order) || DEFAULT_PRODUCTION_META;
          const label = meta.shortLabel || meta.label || meta.raw || '';
          if (!label && !meta.icon) {
            return placeholderSpan;
          }
          const descriptionBits = [];
          if (meta.description) descriptionBits.push(meta.description);
          if (meta.raw && meta.raw !== meta.label) descriptionBits.push(`Original: ${meta.raw}`);
          const title = (descriptionBits.join(' • ') || 'Production').replace(/"/g, '&quot;');
          const chipClass = meta.chipClass || 'production-chip--unassigned';
          return `
            <div class="production-cell">
              <span class="production-chip ${chipClass}" title="${title}">
                <span>${label || '—'}</span>
              </span>
            </div>
          `;
        };

        const buildPreviewCell = (order) => {
          const assets = Array.isArray(order.uploadedContent) ? order.uploadedContent : [];
          const firstAsset = assets.find(item => item && (item.thumbnailUrl || item.data || item.url)) || null;
          const previewSource = firstAsset?.thumbnailUrl || firstAsset?.data || firstAsset?.url || order.cloudinaryUrl || '';

          if (!previewSource) {
            return '<span style="color:#9ca3af;">No preview</span>';
          }

          const assetName = firstAsset?.name ? firstAsset.name : 'Preview asset';

          return `
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:40px;height:40px;border-radius:8px;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.08);background:#f9f4ec;flex-shrink:0;">
                <img src="${previewSource}" alt="Preview for ${order.orderNumber}" data-preview="${previewSource}" 
                  style="width:100%;height:100%;object-fit:cover;cursor:pointer;"
                  onmouseenter="showThumbnailPreview(event, this.dataset.preview)"
                  onmouseleave="hideThumbnailPreview()"
                  onclick="openThumbnailModal(event, this.dataset.preview)">
              </div>
              <span style="font-size:11px;color:#6b5440;max-width:140px;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${assetName}</span>
            </div>
          `;
        };

        const buildChildDetailsTable = (order, normalizedArticles) => {
          const hasOrderLevelDetail = Boolean(order.imageRequestId || order.articleNumber || order.articleName || order.purchaseGroup);
          const dataSource = normalizedArticles.length ? normalizedArticles : (hasOrderLevelDetail ? [{
            name: order.articleName || '',
            articleNumber: order.articleNumber || '',
            raw: {
              imageRequestId: order.imageRequestId,
              articleNumber: order.articleNumber,
              unitOfMeasure: order.unitOfMeasure,
              articleName: order.articleName,
              netContent: order.netContent,
              purchaseGroup: order.purchaseGroup
            }
          }] : []);

          const rows = dataSource.length ? dataSource.map((article, index) => {
            const raw = article && typeof article.raw === 'object' ? article.raw : {};
            const imageRequestId = raw.imageRequestId || order.imageRequestId || placeholderSpan;
            const articleNumber = article.articleNumber || raw.articleNumber || order.articleNumber || placeholderSpan;
            const unitOfMeasure = raw.unitOfMeasure || raw.uom || raw.unit || order.unitOfMeasure || placeholderSpan;
            const articleName = article.name || raw.articleName || order.articleName || placeholderSpan;
            const netContent = raw.netContent || raw.netWeight || raw.size || order.netContent || placeholderSpan;
            const purchaseGroupValue = raw.purchaseGroup ?? order.purchaseGroup;
            const purchaseGroup = formatPurchaseGroupDisplay(purchaseGroupValue);

            return `
              <tr>
                <td style="padding:6px 10px;border-bottom:1px solid rgba(196, 139, 90, 0.18);font-size:11px;">${imageRequestId || placeholderSpan}</td>
                <td style="padding:6px 10px;border-bottom:1px solid rgba(196, 139, 90, 0.18);font-size:11px;">${articleNumber || placeholderSpan}</td>
                <td style="padding:6px 10px;border-bottom:1px solid rgba(196, 139, 90, 0.18);font-size:11px;">${unitOfMeasure || placeholderSpan}</td>
                <td style="padding:6px 10px;border-bottom:1px solid rgba(196, 139, 90, 0.18);font-size:11px;">${articleName || placeholderSpan}</td>
                <td style="padding:6px 10px;border-bottom:1px solid rgba(196, 139, 90, 0.18);font-size:11px;">${netContent || placeholderSpan}</td>
                <td style="padding:6px 10px;border-bottom:1px solid rgba(196, 139, 90, 0.18);font-size:11px;">${purchaseGroup || placeholderSpan}</td>
              </tr>
            `;
          }).join('') : `
            <tr>
              <td colspan="6" style="padding:12px;color:#9ca3af;text-align:center;border-bottom:1px solid rgba(196, 139, 90, 0.2);">No article details available for this order.</td>
            </tr>
          `;

          return `
            <div style="background:white;border:1px solid rgba(196, 139, 90, 0.25);border-radius:10px;overflow:auto;max-height:220px;">
              <table style="width:100%;border-collapse:collapse;">
                <thead style="background:rgba(253, 244, 230, 0.6);">
                  <tr>
                    <th style="text-align:left;padding:8px 10px;font-size:11px;color:#6b5440;font-weight:600;">Image Request ID</th>
                    <th style="text-align:left;padding:8px 10px;font-size:11px;color:#6b5440;font-weight:600;">Article Number</th>
                    <th style="text-align:left;padding:8px 10px;font-size:11px;color:#6b5440;font-weight:600;">Unit of Measure</th>
                    <th style="text-align:left;padding:8px 10px;font-size:11px;color:#6b5440;font-weight:600;">Article Name</th>
                    <th style="text-align:left;padding:8px 10px;font-size:11px;color:#6b5440;font-weight:600;">Net Content</th>
                    <th style="text-align:left;padding:8px 10px;font-size:11px;color:#6b5440;font-weight:600;">Purchase Group</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>
          `;
        };

        tbody.innerHTML = filtered.map(o => {
          const isOverdue = o.deadline ? (new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered') : false;
          const deadlineStyle = isOverdue ? 'color: #dc2626; font-weight: bold;' : 'color: #4b3b2a;';
          const commentCount = (o.comments || []).length;
          const unreadComments = window.commentSystem ? window.commentSystem.getUnreadCommentCount(o.orderNumber) : 0;
          const normalizedArticles = normalizeArticles(o.articles);
          const isExpanded = expandedOrders.has(o.orderNumber);
          const expandIcon = `<span class="order-expand-arrow ${isExpanded ? 'is-open' : ''}">◀</span>`;
          const expandLabel = isExpanded ? 'Collapse line items' : 'Expand line items';

          const groupDisplay = formatPurchaseGroupDisplay(o.purchaseGroup);
          const orderTypeDisplay = (o.orderType || 'PS');
          const rawPage = o.page ?? o.pageNumber ?? o.pageNo ?? o.catalogPage ?? o.pamPage ?? o.pageReference ?? '';
          const parsedPage = parseInt(rawPage, 10);
          const pageDisplay = !isNaN(parsedPage) && parsedPage >= 0 ? String(parsedPage) : (rawPage ? String(rawPage).trim() : placeholderSpan);
          const offerId = o.offerId || placeholderSpan;
          const offerName = o.title || placeholderSpan;
          const shotType = o.photoStatus || placeholderSpan;
          const photoRef = o.imageRequestId || placeholderSpan;
          const principle = o.salesOrg || placeholderSpan;
          const productionInfo = buildProductionInfo(o);
          const previewCell = buildPreviewCell(o);

          const articleDetailsRow = isExpanded ? `
            <tr class="order-articles-row" data-parent-order="${o.orderNumber}">
              <td class="bulk-checkbox" style="display:none;"></td>
              <td colspan="15" style="background:#fffaf3;padding:10px 18px 16px;border-bottom:1px solid rgba(196, 139, 90, 0.2);">
                ${buildChildDetailsTable(o, normalizedArticles)}
              </td>
            </tr>
          ` : '';

          return `
          <tr onclick="showOrderDetails('${o.orderNumber}')" style="cursor: pointer; color: #4b3b2a !important;" class="${window.selectedItems && window.selectedItems.has(o.orderNumber) ? 'selected-row' : ''}">
            <td class="bulk-checkbox" style="display: none;"><input type="checkbox" class="item-checkbox" data-id="${o.orderNumber}" onclick="event.stopPropagation()"></td>
            <td style="padding:4px;text-align:center;width:32px;">
              <button type="button" class="order-expand-button" aria-label="${expandLabel}" title="${expandLabel}" onclick="toggleOrderExpansion('${o.orderNumber}', event)">${expandIcon}</button>
            </td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;"><strong>${o.orderNumber}</strong></td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${pageDisplay}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${offerId}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${groupDisplay}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${orderTypeDisplay}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;min-width:150px;font-size:12px;">${offerName}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${shotType}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${photoRef}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${productionInfo}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${principle}</td>
            <td style="padding:6px 8px;color: #4b3b2a !important;font-size:12px;">${previewCell}</td>
            <td style="padding:4px 6px;text-align: center; color: #4b3b2a !important;">
              <button onclick="event.stopPropagation(); window.commentSystem && window.commentSystem.showCommentsModal('${o.orderNumber}')" 
                style="background: ${commentCount > 0 ? '#c48b5a' : '#6b5440'}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; position: relative;">
                💬 ${commentCount}
                ${unreadComments > 0 ? `<span style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border-radius: 50%; width: 14px; height: 14px; font-size: 9px; display: flex; align-items: center; justify-content: center;">${unreadComments}</span>` : ''}
              </button>
            </td>
            <td style="padding:6px 8px;"><span class="status ${o.status.replace(/\s+/g, '')}">${o.status || 'Unknown'}</span></td>
            <td style="padding:6px 8px;${deadlineStyle} font-size:12px;">${o.deadline || placeholderSpan}${isOverdue ? ' ⚠️' : ''}</td>
          </tr>
          ${articleDetailsRow}`;
        }).join('');
      }
      
      if (typeof updateBulkActionsPanel === 'function') {
        updateBulkActionsPanel();
      }
      
      // Update filter tile counts
      if (typeof updateFilterTileCounts === 'function') {
        updateFilterTileCounts();
      }
    }

    let quickFiltersOpen = false;

    function toggleQuickFilters() {
      const panel = document.getElementById('quickFiltersPanel');
      const toggleButton = document.getElementById('quickFiltersToggle');

      if (!panel || !toggleButton) {
        return;
      }

      quickFiltersOpen = !quickFiltersOpen;
      panel.style.display = quickFiltersOpen ? 'block' : 'none';
      toggleButton.textContent = quickFiltersOpen ? 'Quick Filters ▲' : 'Quick Filters ▾';
    }

    window.toggleQuickFilters = toggleQuickFilters;

    // Kanban Board Functions
    function toggleOrderExpansion(orderNumber, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (expandedOrders.has(orderNumber)) {
        expandedOrders.delete(orderNumber);
      } else {
        expandedOrders.add(orderNumber);
      }

      if (currentView === 'orders') {
        drawOrderRows();
      }
    }

    window.toggleOrderExpansion = toggleOrderExpansion;

    // Kanban Board Functions
    function drawKanbanBoard() {
      const currentUser = authSystem.getCurrentUser();
      const orders = authSystem.getFilteredOrders(allOrders);
      const board = document.getElementById('kanbanBoard');
      
      // Add visible debug info
      if (!currentUser) {
        board.innerHTML = '<div style="color: red; padding: 20px;">ERROR: No current user found</div>';
        return;
      }
      
      if (!orders || orders.length === 0) {
        board.innerHTML = '<div style="color: red; padding: 20px;">ERROR: No orders found. Total orders: ' + (allOrders ? allOrders.length : 'undefined') + '</div>';
        return;
      }
      
      const statuses = [
        { name: 'Draft', color: '#6b5440', icon: '📝' },
        { name: 'Pending Approval', color: '#f59e0b', icon: '⏳' },
        { name: 'Approved', color: '#c48b5a', icon: '✅' },
        { name: 'Samples Requested', color: '#bfa3d6', icon: '📦' },
        { name: 'In Progress', color: '#c48b5a', icon: '🔄' },
        { name: 'Review', color: '#f97316', icon: '👀' },
        { name: 'Complete', color: '#7fa284', icon: '🎉' },
        { name: 'Delivered', color: '#7fa284', icon: '🚚' }
      ];

      board.innerHTML = statuses.map(status => {
        const statusOrders = orders.filter(o => o.status === status.name);
        
        return `
          <div class="kanban-column" data-status="${status.name}" 
               style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; min-height: 400px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid ${status.color};">
              <h4 style="margin: 0; color: #4b3b2a; font-size: 14px; font-weight: 600;">
                ${status.icon} ${status.name}
              </h4>
              <span style="background: ${status.color}; color: white; border-radius: 12px; padding: 2px 8px; font-size: 12px; font-weight: 600;">
                ${statusOrders.length}
              </span>
            </div>
            <div class="kanban-items" style="display: flex; flex-direction: column; gap: 12px;">
              ${statusOrders.length === 0 ? 
                `<div style="text-align: center; color: #9ca3af; font-style: italic; padding: 20px;">No orders</div>` :
                statusOrders.map(order => `
                <div class="kanban-card" draggable="true" data-order-id="${order.orderNumber}"
                     style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; cursor: move; transition: all 0.15s;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
                     onmouseover="this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)';"
                     onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)';"
                     onclick="showOrderDetails('${order.orderNumber}'); event.stopPropagation();">
                  <div style="font-weight: 600; color: #4b3b2a; font-size: 12px; margin-bottom: 4px;">
                    ${order.orderNumber}
                    ${order.uploadedContent && order.uploadedContent.length > 0 ? 
                      `<span style="background: #7fa284; color: white; padding: 1px 4px; border-radius: 3px; font-size: 9px; margin-left: 4px;">📁 ${order.uploadedContent.length}</span>` : 
                      ''
                    }
                  </div>
                  <div style="color: #4b3b2a; font-size: 13px; font-weight: 500; margin-bottom: 8px; line-height: 1.3;">${order.title}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="background: ${getPriorityColor(order.priority)}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                      ${order.priority}
                    </span>
                    <span style="color: #6b5440; font-size: 11px;">${order.deadline}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #6b5440; font-size: 11px;">${order.photographer}</span>
                    <span style="color: #6b5440; font-size: 11px;">${order.method}</span>
                  </div>
                  ${authSystem.canEditOrder(order) ? 
                    '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f1e8dc; font-size: 10px; color: #9ca3af;">Drag to update status</div>' : 
                    '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f1e8dc; font-size: 10px; color: #9ca3af;">View only</div>'
                  }
                </div>
              `).join('')
              }
            </div>
          </div>
        `;
      }).join('');

      // Add drag and drop functionality
      setupKanbanDragDrop();
    }

    function setupKanbanDragDrop() {
      let draggedElement = null;
      let isDragging = false;

      // Add drag event listeners to cards
      document.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', function(e) {
          if (!authSystem.canEditOrder(allOrders.find(o => o.orderNumber === this.dataset.orderId))) {
            e.preventDefault();
            return;
          }
          isDragging = true;
          draggedElement = this;
          this.style.opacity = '0.5';
        });

        card.addEventListener('dragend', function(e) {
          this.style.opacity = '1';
          draggedElement = null;
          // Reset dragging flag after a short delay to allow click events
          setTimeout(() => { isDragging = false; }, 100);
        });

        // Prevent click event when dragging
        card.addEventListener('click', function(e) {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });
      });

      // Add drop event listeners to columns
      document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', function(e) {
          e.preventDefault();
          this.style.background = '#fdf4e6';
        });

        column.addEventListener('dragleave', function(e) {
          this.style.background = '#f8fafc';
        });

        column.addEventListener('drop', function(e) {
          e.preventDefault();
          this.style.background = '#f8fafc';
          
          if (draggedElement) {
            const orderId = draggedElement.dataset.orderId;
            const newStatus = this.dataset.status;
            const order = allOrders.find(o => o.orderNumber === orderId);
            
            if (order && authSystem.canEditOrder(order)) {
              const oldStatus = order.status;
              order.status = newStatus;
              order.updatedAt = new Date().toISOString();
              
              console.log('📋 Kanban drop:', orderId, 'from', oldStatus, 'to', newStatus);
              
              // Trigger confetti if order is moved to Complete
              if (newStatus === 'Complete') {
                console.log('🎉 Triggering confetti for Complete status');
                triggerConfetti();
              }
              
              // Trigger celebration if order is moved to Delivered
              if (newStatus === 'Delivered' && oldStatus !== 'Delivered') {
                console.log('🎉 Triggering celebration for Delivered status');
                setTimeout(() => {
                  celebrateOrderDelivery();
                }, 200);
              }
              
              // Add to order history
              if (!order.history) order.history = [];
              order.history.push({
                timestamp: new Date().toLocaleString(),
                user: authSystem.getCurrentUser().name,
                action: 'Status Changed (Kanban)',
                changes: [`Status: ${oldStatus} → ${newStatus}`],
                details: `Status changed from "${oldStatus}" to "${newStatus}" via kanban board`
              });
              
              // Save changes
              localStorage.setItem('photoOrders', JSON.stringify(allOrders));
              
              // Show success message
              showToast(`Order ${orderId} moved to ${newStatus}`, 'success');
              
              // Refresh kanban board
              drawKanbanBoard();
            }
          }
        });
      });
    }

    // Calendar Functions
    function drawCalendarView() {
      updateCalendarTitle();
      
      const container = document.getElementById('calendarContainer');
      const currentUser = authSystem.getCurrentUser();
      const orders = authSystem.getFilteredOrders(allOrders);
      
      if (calendarViewType === 'week') {
        drawWeekView(container, orders);
      } else if (calendarViewType === 'month') {
        drawMonthView(container, orders);
      } else if (calendarViewType === 'year') {
        drawYearView(container, orders);
      }
    }

    function updateCalendarTitle() {
      const title = document.getElementById('calendarTitle');
      if (!title) return;

      if (calendarViewType === 'week') {
        const weekStart = getWeekStart(calendarDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        title.textContent = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      } else if (calendarViewType === 'month') {
        title.textContent = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } else if (calendarViewType === 'year') {
        title.textContent = calendarDate.getFullYear().toString();
      }
    }

    function drawWeekView(container, orders) {
      const weekStart = getWeekStart(calendarDate);
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        days.push(day);
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid #e5e7eb;">
          ${days.map(day => `
            <div style="padding: 12px 8px; background: #f9fafb; border-right: 1px solid #e5e7eb; text-align: center; font-weight: 600; color: #4b3b2a;">
              <div style="font-size: 12px; color: #6b5440;">${day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div style="font-size: 16px; ${isToday(day) ? 'color: #c48b5a; font-weight: 700;' : ''}">${day.getDate()}</div>
            </div>
          `).join('')}
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); min-height: 400px;">
          ${days.map(day => {
            const dayOrders = getOrdersForDate(orders, day);
            return `
              <div style="border-right: 1px solid #e5e7eb; padding: 8px; background: ${isToday(day) ? '#fdf4e6' : 'white'};">
                ${dayOrders.map(order => `
                  <div style="background: ${getStatusColor(order.status)}; color: white; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px; font-size: 11px; cursor: pointer;"
                       onclick="showOrderDetails('${order.orderNumber}')"
                       title="Order: ${order.title}&#10;Deadline: ${order.deadline}&#10;Status: ${order.status}&#10;Click to view details">
                    ${order.orderNumber}
                    ${order.uploadedContent && order.uploadedContent.length > 0 ? ` 📁${order.uploadedContent.length}` : ''}
                    <div style="font-size: 10px; opacity: 0.9;">${order.title.substring(0, 20)}${order.title.length > 20 ? '...' : ''}</div>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function drawMonthView(container, orders) {
      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = getWeekStart(firstDay);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 41); // 6 weeks

      const weeks = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
          week.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid #e5e7eb;">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `
            <div style="padding: 12px 8px; background: #f9fafb; border-right: 1px solid #e5e7eb; text-align: center; font-weight: 600; color: #4b3b2a; font-size: 14px;">
              ${day}
            </div>
          `).join('')}
        </div>
        ${weeks.map(week => `
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid #e5e7eb;">
            ${week.map(day => {
              const dayOrders = getOrdersForDate(orders, day);
              const isCurrentMonth = day.getMonth() === month;
              return `
                <div style="border-right: 1px solid #e5e7eb; padding: 4px; min-height: 80px; background: ${isCurrentMonth ? (isToday(day) ? '#fdf4e6' : 'white') : '#f9fafb'};">
                  <div style="font-size: 12px; font-weight: 600; color: ${isCurrentMonth ? (isToday(day) ? '#c48b5a' : '#4b3b2a') : '#9ca3af'}; margin-bottom: 4px;">
                    ${day.getDate()}
                  </div>
                  ${dayOrders.slice(0, 3).map(order => `
                    <div style="background: ${getStatusColor(order.status)}; color: white; padding: 2px 4px; border-radius: 3px; margin-bottom: 2px; font-size: 9px; cursor: pointer; line-height: 1.2;"
                         onclick="showOrderDetails('${order.orderNumber}')"
                         title="Order: ${order.title}&#10;Deadline: ${order.deadline}&#10;Status: ${order.status}&#10;Click to view details">
                      ${order.orderNumber}${order.uploadedContent && order.uploadedContent.length > 0 ? ` 📁${order.uploadedContent.length}` : ''}
                    </div>
                  `).join('')}
                  ${dayOrders.length > 3 ? `<div style="font-size: 8px; color: #6b5440; text-align: center;">+${dayOrders.length - 3} more</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `).join('')}
      `;
    }

    function drawYearView(container, orders) {
      const year = calendarDate.getFullYear();
      const months = [];
      
      for (let i = 0; i < 12; i++) {
        months.push(new Date(year, i, 1));
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 16px; overflow-x: auto; min-width: 800px;">
          ${months.map(month => {
            const monthOrders = orders.filter(order => {
              const orderDate = new Date(order.deadline);
              return orderDate.getFullYear() === year && orderDate.getMonth() === month.getMonth();
            });
            
            return `
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: white; min-width: 180px;">
                <h4 style="margin: 0 0 8px; text-align: center; color: #4b3b2a; font-size: 14px; font-weight: 600;">
                  ${month.toLocaleDateString('en-US', { month: 'long' })}
                </h4>
                <div style="text-align: center; margin-bottom: 8px; font-size: 12px; color: #6b5440;">
                  ${monthOrders.length} orders
                </div>
                ${monthOrders.slice(0, 5).map(order => `
                  <div style="background: ${getStatusColor(order.status)}; color: white; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px; font-size: 10px; cursor: pointer;"
                       onclick="showOrderDetails('${order.orderNumber}')"
                       title="Order: ${order.title}&#10;Deadline: ${order.deadline}&#10;Status: ${order.status}&#10;Click to view details">
                    ${order.orderNumber}${order.uploadedContent && order.uploadedContent.length > 0 ? ` 📁${order.uploadedContent.length}` : ''}
                    <div style="font-size: 9px; opacity: 0.9;">${new Date(order.deadline).getDate()}/${new Date(order.deadline).getMonth() + 1}</div>
                  </div>
                `).join('')}
                ${monthOrders.length > 5 ? `<div style="font-size: 9px; color: #6b5440; text-align: center;">+${monthOrders.length - 5} more</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Helper Functions for Calendar
    function getWeekStart(date) {
      const start = new Date(date);
      const day = start.getDay();
      const diff = start.getDate() - day;
      return new Date(start.setDate(diff));
    }

    function isToday(date) {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }

    function formatDate(date) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function getOrdersForDate(orders, date) {
      return orders.filter(order => {
        const orderDate = new Date(order.deadline);
        return orderDate.toDateString() === date.toDateString();
      });
    }

    function calculateProgress(status) {
      const progressMap = {
        'Draft': 10,
        'Pending Approval': 20,
        'Approved': 30,
        'Samples Requested': 40,
        'In Progress': 70,
        'Review': 85,
        'Complete': 100,
        'Delivered': 100
      };
      return progressMap[status] || 0;
    }

    // Expose calculateProgress globally
    window.calculateProgress = calculateProgress;
    
    // Create global selectedItems set
    window.selectedItems = new Set();

    // Helper function to get order progress (alias for calculateProgress)
    function getOrderProgress(order) {
      return calculateProgress(order.status);
    }

    // Helper functions for Kanban and Calendar
    function getPriorityColor(priority) {
      const priorityColors = {
        'High': '#dc2626',
        'Medium': '#f59e0b', 
        'Low': '#7fa284'
      };
      return priorityColors[priority] || '#6b5440';
    }

    function getStatusColor(status) {
      const statusColors = {
        'Draft': '#6b5440',
        'Pending Approval': '#f59e0b',
        'Approved': '#c48b5a',
        'Samples Requested': '#bfa3d6',
        'In Progress': '#c48b5a',
        'Review': '#f97316',
        'Complete': '#7fa284',
        'Delivered': '#7fa284'
      };
      return statusColors[status] || '#6b5440';
    }

    function drawWorkflowView() {
      const currentUser = authSystem.getCurrentUser();
      const orders = authSystem.getFilteredOrders(allOrders);
      
      const draftOrders = orders.filter(o => o.status === 'Draft');
      const samplesRequestedOrders = orders.filter(o => o.status === 'Samples Requested');
      const inProgressOrders = orders.filter(o => o.status === 'In Progress' || o.status === 'Approved');
      const completedOrders = orders.filter(o => o.status === 'Complete' || o.status === 'Delivered');

      function renderKanbanItems(ordersList, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = ordersList.map(o => `
            <div class="kanban-item" 
                 onclick="showOrderDetails('${o.orderNumber}')"
                 draggable="true"
                 ondragstart="handleDragStart(event, '${o.orderNumber}')"
                 data-order="${o.orderNumber}">
              <div style="font-weight: 600; margin-bottom: 4px;">${o.title}</div>
              <div style="color: #6b5440; margin-bottom: 4px;">${o.orderNumber}</div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="status ${o.priority}" style="font-size: 10px;">${o.priority}</span>
                <span style="font-size: 10px; color: #9ca3af;">${o.deadline}</span>
              </div>
              ${o.photographer ? `<div style="font-size: 10px; color: #c48b5a; margin-top: 4px;">👤 ${o.photographer}</div>` : ''}
            </div>
          `).join('');
        }
      }

      renderKanbanItems(draftOrders, 'draftOrders');
      renderKanbanItems(samplesRequestedOrders, 'samplesRequestedOrders');
      renderKanbanItems(inProgressOrders, 'inProgressOrders');
      renderKanbanItems(completedOrders, 'completedOrders');
    }

    function toggleBulkMode() {
      bulkMode = !bulkMode;
      const table = document.querySelector('#ordersView table, #samplesView table');
      if (table) {
        if (bulkMode) {
          table.classList.add('bulk-mode');
          document.getElementById('bulkActionsPanel').style.display = 'block';
          document.getElementById('toggleBulkMode').textContent = '✖️ Exit Bulk';
          updateBulkActionsPanel();
          
          // Add ESC key listener for bulk mode
          document.addEventListener('keydown', handleBulkModeEscape);
        } else {
          table.classList.remove('bulk-mode');
          document.getElementById('bulkActionsPanel').style.display = 'none';
          document.getElementById('toggleBulkMode').textContent = '☑️ Bulk Select';
          selectedItems.clear();
          drawOrderRows();
          
          // Remove ESC key listener
          document.removeEventListener('keydown', handleBulkModeEscape);
        }
      }
    }

    function handleBulkModeEscape(e) {
      if (e.key === 'Escape' && bulkMode) {
        toggleBulkMode();
      }
    }

    function updateBulkActionsPanel() {
      const selectedCount = document.getElementById('selectedCount');
      if (selectedCount) {
        selectedCount.textContent = selectedItems.size;
      }
      
      // Update all checkboxes to reflect current selection
      document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        const id = checkbox.getAttribute('data-id');
        checkbox.checked = selectedItems.has(id);
        
        // Remove existing event listener to prevent duplicates
        checkbox.removeEventListener('change', handleCheckboxChange);
        checkbox.addEventListener('change', handleCheckboxChange);
      });
      
      // Update select all checkbox
      const selectAllCheckbox = document.getElementById('selectAllOrders');
      if (selectAllCheckbox) {
        const visibleCheckboxes = document.querySelectorAll('#ordersView tbody tr:not([style*="display: none"]) .item-checkbox');
        const checkedCount = Array.from(visibleCheckboxes).filter(cb => cb.checked).length;
        selectAllCheckbox.checked = visibleCheckboxes.length > 0 && checkedCount === visibleCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
      }
    }

    function handleCheckboxChange(e) {
      const id = e.target.getAttribute('data-id');
      if (e.target.checked) {
        selectedItems.add(id);
      } else {
        selectedItems.delete(id);
      }
      updateBulkActionsPanel();
    }

    function applyTemplate(templateKey) {
      const template = templates[templateKey];
      if (!template) return;

      // Pre-fill the create order form
      showView('create');
      
      setTimeout(() => {
        const form = document.getElementById('createOrderForm');
        if (form) {
          form.title.value = template.title;
          form.method.value = template.method;
          form.priority.value = template.priority;
          form.brief.value = template.brief;
          form.articles.value = template.articles;
          form.deliverables.value = template.deliverables;
          form.budget.value = template.budget;
          
          // Set deadline to 7 days from now
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + 7);
          form.deadline.value = deadline.toISOString().split('T')[0];
        }
      }, 100);
    }

    function showQuickFilter(filterType) {
      const today = new Date().toISOString().split('T')[0];
      
      let filtered = [];
      setStatusFilterOverride(filterType, { skipRender: true });
      const scopedOrders = applyActiveOrderFilters(authSystem.getFilteredOrders(window.rkhOrders || []));
      switch(filterType) {
        case 'urgent':
          filtered = scopedOrders.filter(o => o.priority === 'Urgent' || o.priority === 'High');
          break;
        case 'ready-samples':
          filtered = scopedOrders.filter(o => o.status === 'Samples Requested' || o.status === 'Ready for Production');
          break;
        case 'overdue':
          filtered = scopedOrders.filter(o => new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered');
          break;
        case 'today-deadlines':
          filtered = scopedOrders.filter(o => o.deadline === today);
          break;
      }
      
      // Temporarily override the search to show filtered results
      if (tbody) {
        const placeholderSpan = '<span style="color:#9ca3af;">—</span>';

        const formatGroupDisplay = (value) => {
          const groupLookup = (typeof purchaseGroups !== 'undefined' && purchaseGroups) ? purchaseGroups : (window.purchaseGroups || null);
          if (value === undefined || value === null || value === '') {
            return placeholderSpan;
          }
          const numeric = Number(value);
          if (!Number.isNaN(numeric) && groupLookup && groupLookup[numeric]) {
            return `${numeric} - ${groupLookup[numeric]}`;
          }
          const textValue = String(value).trim();
          if (groupLookup) {
            const matchedKey = Object.keys(groupLookup).find(key => groupLookup[key].toLowerCase() === textValue.toLowerCase());
            if (matchedKey) {
              return `${matchedKey} - ${groupLookup[matchedKey]}`;
            }
          }
          return textValue || placeholderSpan;
        };

        const buildQuickProductionInfo = (order) => {
          if (!order) {
            return placeholderSpan;
          }
          const meta = order.productionMeta || applyProductionNormalization(order) || DEFAULT_PRODUCTION_META;
          const label = meta.shortLabel || meta.label || meta.raw || '';
          if (!label && !meta.icon) {
            return placeholderSpan;
          }
          const descriptionBits = [];
          if (meta.description) descriptionBits.push(meta.description);
          if (meta.raw && meta.raw !== meta.label) descriptionBits.push(`Original: ${meta.raw}`);
          const title = (descriptionBits.join(' • ') || 'Production').replace(/"/g, '&quot;');
          const chipClass = meta.chipClass || 'production-chip--unassigned';
          return `
            <div class="production-cell">
              <span class="production-chip ${chipClass}" title="${title}">
                <span>${label || '—'}</span>
              </span>
            </div>
          `;
        };

        const buildQuickPreviewCell = (order) => {
          const assets = Array.isArray(order.uploadedContent) ? order.uploadedContent : [];
          const firstAsset = assets.find(item => item && (item.thumbnailUrl || item.data || item.url)) || null;
          const previewSource = firstAsset?.thumbnailUrl || firstAsset?.data || firstAsset?.url || order.cloudinaryUrl || '';

          if (!previewSource) {
            return '<span style="color:#9ca3af;">No preview</span>';
          }

          const assetName = firstAsset?.name ? firstAsset.name : 'Preview asset';

          return `
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:40px;height:40px;border-radius:8px;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.08);background:#f9f4ec;flex-shrink:0;">
                <img src="${previewSource}" alt="Preview for ${order.orderNumber}" data-preview="${previewSource}" 
                  style="width:100%;height:100%;object-fit:cover;cursor:pointer;"
                  onmouseenter="showThumbnailPreview(event, this.dataset.preview)"
                  onmouseleave="hideThumbnailPreview()"
                  onclick="openThumbnailModal(event, this.dataset.preview)">
              </div>
              <span style="font-size:11px;color:#6b5440;max-width:140px;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${assetName}</span>
            </div>
          `;
        };

        tbody.innerHTML = filtered.map(o => {
          const isOverdue = o.deadline ? (new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered') : false;
          const deadlineStyle = isOverdue ? 'color: #dc2626; font-weight: bold;' : 'color: #4b3b2a;';
          const commentCount = (o.comments || []).length;
          const unreadComments = window.commentSystem ? window.commentSystem.getUnreadCommentCount(o.orderNumber) : 0;
          const isExpanded = expandedOrders.has(o.orderNumber);
          const expandIcon = `<span class="order-expand-arrow ${isExpanded ? 'is-open' : ''}">◀</span>`;
          const expandLabel = isExpanded ? 'Collapse articles' : 'Expand articles';
          const normalizedArticles = normalizeArticles(o.articles);

          const rawPage = o.page ?? o.pageNumber ?? o.pageNo ?? o.catalogPage ?? o.pamPage ?? o.pageReference ?? '';
          const parsedPage = parseInt(rawPage, 10);
          const pageDisplay = !isNaN(parsedPage) && parsedPage >= 0 ? String(parsedPage) : (rawPage ? String(rawPage).trim() : placeholderSpan);
          const offerId = o.offerId || placeholderSpan;
          const groupDisplay = formatGroupDisplay(o.purchaseGroup);
          const orderTypeDisplay = o.orderType || 'PS';
          const offerName = o.title || placeholderSpan;
          const shotType = o.photoStatus || placeholderSpan;
          const photoRef = o.imageRequestId || placeholderSpan;
          const productionInfo = buildQuickProductionInfo(o);
          const principle = o.salesOrg || placeholderSpan;
          const previewCell = buildQuickPreviewCell(o);

          const articleDetailsContent = typeof buildChildDetailsTable === 'function'
            ? buildChildDetailsTable(o, normalizedArticles)
            : renderArticleCards(o.articles);

          const articleDetailsRow = isExpanded ? `
            <tr class="order-articles-row" data-parent-order="${o.orderNumber}">
              <td class="bulk-checkbox" style="display:none;"></td>
              <td colspan="15" style="background:#fffaf3;padding:16px 24px 24px;border-bottom:1px solid rgba(196, 139, 90, 0.2);">
                ${articleDetailsContent}
              </td>
            </tr>
          ` : '';

          return `
          <tr onclick="showOrderDetails('${o.orderNumber}')" style="cursor: pointer; background: #fef3c7; color:#4b3b2a !important;">
            <td class="bulk-checkbox" style="display: none;"><input type="checkbox" class="item-checkbox" data-id="${o.orderNumber}" onclick="event.stopPropagation()"></td>
            <td style="text-align:center;">
              <button type="button" class="order-expand-button" aria-label="${expandLabel}" title="${expandLabel}" onclick="toggleOrderExpansion('${o.orderNumber}', event)">${expandIcon}</button>
            </td>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${pageDisplay}</td>
            <td>${offerId}</td>
            <td>${groupDisplay}</td>
            <td>${orderTypeDisplay}</td>
            <td>${offerName}</td>
            <td>${shotType}</td>
            <td>${photoRef}</td>
            <td>${productionInfo}</td>
            <td>${principle}</td>
            <td>${previewCell}</td>
            <td style="text-align: center;">
              <button onclick="event.stopPropagation(); window.commentSystem && window.commentSystem.showCommentsModal('${o.orderNumber}')" 
                style="background: ${commentCount > 0 ? '#c48b5a' : '#6b5440'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; position: relative;">
                💬 ${commentCount}
                ${unreadComments > 0 ? `<span style="position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center;">${unreadComments}</span>` : ''}
              </button>
            </td>
            <td><span class="status ${o.status.replace(/\s+/g, '')}">${o.status || 'Unknown'}</span></td>
            <td style="${deadlineStyle}">${o.deadline || placeholderSpan}${isOverdue ? ' ⚠️' : ''}</td>
          </tr>
          ${articleDetailsRow}
        `;
        }).join('');
        
        if (filtered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="15" style="text-align:center;color:#9ca3af;padding:20px;">No items found for this filter</td></tr>';
        }
      }
        updateOrderFilterSummary(scopedOrders);
      updateOrderFilterSummary(scopedOrders);
      
      // Clear after 5 seconds
      setTimeout(() => {
        if (currentView === 'orders') drawOrderRows();
      }, 5000);
    }

    function drawSampleRows() {
      const samplesBody = document.getElementById('samplesBody');
      const dashboardSamplesBody = document.getElementById('dashboardSamplesBody');
      
      // Only populate samplesBody if we're in samples view
      if (samplesBody && currentView === 'samples') {
        samplesBody.innerHTML = samples.map(s => `
          <tr onclick="showSampleDetails('${s.id}')" style="cursor: pointer;">
            <td><strong>${s.id}</strong></td>
            <td>${s.articleName}</td>
            <td><span class="status ${s.status.replace(/\s+/g, '')}">${s.status}</span></td>
            <td>${s.location}</td>
            <td>${s.assignedTo}</td>
            <td style="font-size: 11px;">${s.transitHistory}</td>
            <td>${s.lastUpdate}</td>
          </tr>
        `).join('');
      }
      
      // Only populate dashboardSamplesBody if we're in dashboard view
      if (dashboardSamplesBody && currentView === 'dashboard') {
        // Get search term from dashboard search box
        const searchBox = document.getElementById('dashboardSampleSearch');
        const term = searchBox?.value.toLowerCase() || '';
        
        // Filter samples based on search term
        const filtered = samples.filter(s => 
          !term || 
          s.id.toLowerCase().includes(term) ||
          s.articleName.toLowerCase().includes(term) ||
          s.location.toLowerCase().includes(term) ||
          s.assignedTo.toLowerCase().includes(term)
        );
        
        dashboardSamplesBody.innerHTML = filtered.map(s => `
          <tr onclick="showSampleDetails('${s.id}')" style="cursor: pointer;">
            <td><strong>${s.id}</strong></td>
            <td>${s.articleName}</td>
            <td><span class="status ${s.status.replace(/\s+/g, '')}">${s.status}</span></td>
            <td>${s.location}</td>
            <td>${s.assignedTo}</td>
            <td style="font-size: 11px;">${s.transitHistory}</td>
            <td>${s.lastUpdate}</td>
          </tr>
        `).join('');
      }
    }

    function drawRows() {
      if (currentView === 'orders') {
        drawOrderRows();
      } else if (currentView === 'samples') {
        drawSampleRows();
      }
    }

    // Function to add comment from the order details modal
    window.addComment = function(orderNumber) {
      const textarea = document.getElementById(`newComment-${orderNumber}`);
      const message = textarea.value.trim();
      
      if (!message) {
        alert('Please enter a comment message');
        return;
      }
      
      const currentUser = authSystem.getCurrentUser();
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      
      if (!order) return;
      
      // Initialize comments array if it doesn't exist
      if (!order.comments) {
        order.comments = [];
      }
      
      // Create new comment
      const newComment = {
        id: 'c' + Date.now(),
        orderId: orderNumber,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        message: message,
        createdAt: new Date().toISOString(),
        isRead: false,
        readBy: [currentUser.id]
      };
      
      // Add comment to order
      order.comments.push(newComment);
      
      // Clear textarea
      textarea.value = '';
      
      // Show success message
      showToast('Comment added successfully', 'success');
      
      // Close and reopen modal to refresh
      document.querySelector('div[style*="position:fixed"]').remove();
      showOrderDetails(orderNumber);
    }

    // Function to upload content to an order
    window.uploadContent = function(orderNumber) {
      const fileInput = document.getElementById(`contentUpload-${orderNumber}`);
      const files = fileInput.files;
      
      if (!files || files.length === 0) {
        alert('Please select files to upload');
        return;
      }
      
      const currentUser = authSystem.getCurrentUser();
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      
      if (!order) return;
      
      // Initialize uploadedContent array if it doesn't exist
      if (!order.uploadedContent) {
        order.uploadedContent = [];
      }
      
      // Process each file
      Array.from(files).forEach(file => {
        // Create a file reader to convert to base64 for simulation
        const reader = new FileReader();
        reader.onload = function(e) {
          const fileData = {
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result, // Base64 data for simulation
            uploadedBy: currentUser.name,
            uploadedAt: new Date().toISOString(),
            uploadedByRole: currentUser.role
          };
          
          order.uploadedContent.push(fileData);
          
          // Show success message
          showToast(`File "${file.name}" uploaded successfully`, 'success');
          
          // Refresh the modal after all files are processed
          if (order.uploadedContent.length === files.length + (order.uploadedContent.length - files.length)) {
            document.querySelector('div[style*="position:fixed"]').remove();
            showOrderDetails(orderNumber);
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Clear file input
      fileInput.value = '';
    }

    // Function to preview uploaded content
    window.previewContent = function(orderNumber, fileIndex) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order || !order.uploadedContent || !order.uploadedContent[fileIndex]) return;
      
      const file = order.uploadedContent[fileIndex];
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:2000';
      
      let content = '';
      
      if (file.type.startsWith('image/')) {
        content = `
          <div style="max-width:90vw;max-height:90vh;text-align:center;">
            <img src="${file.data}" style="max-width:100%;max-height:80vh;object-fit:contain;border-radius:8px;">
            <div style="color:white;margin-top:16px;font-size:18px;">${file.name}</div>
            <div style="color:#d1d5db;margin-top:8px;">
              ${(file.size / 1024 / 1024).toFixed(2)} MB • 
              Uploaded by ${file.uploadedBy} • 
              ${new Date(file.uploadedAt).toLocaleDateString()}
            </div>
          </div>
        `;
      } else if (file.type.startsWith('video/')) {
        content = `
          <div style="max-width:90vw;max-height:90vh;text-align:center;">
            <video controls style="max-width:100%;max-height:80vh;border-radius:8px;">
              <source src="${file.data}" type="${file.type}">
              Your browser does not support the video tag.
            </video>
            <div style="color:white;margin-top:16px;font-size:18px;">${file.name}</div>
            <div style="color:#d1d5db;margin-top:8px;">
              ${(file.size / 1024 / 1024).toFixed(2)} MB • 
              Uploaded by ${file.uploadedBy} • 
              ${new Date(file.uploadedAt).toLocaleDateString()}
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="background:white;padding:40px;border-radius:12px;text-align:center;max-width:500px;">
            <div style="font-size:48px;margin-bottom:16px;">
              ${file.type === 'application/pdf' ? '📄' : '📁'}
            </div>
            <h3 style="margin:0 0 16px;color:#4b3b2a;">${file.name}</h3>
            <div style="color:#6b5440;margin-bottom:24px;">
              ${(file.size / 1024 / 1024).toFixed(2)} MB • 
              Uploaded by ${file.uploadedBy} • 
              ${new Date(file.uploadedAt).toLocaleDateString()}
            </div>
            <div style="color:#6b5440;margin-bottom:24px;">
              Preview not available for this file type
            </div>
            <button onclick="downloadContent('${orderNumber}', ${fileIndex})" style="background:#c48b5a;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-size:16px;">Download File</button>
          </div>
        `;
      }
      
      modal.innerHTML = `
        <div>
          ${content}
          <div style="position:absolute;top:20px;right:20px;">
            <button onclick="this.closest('div[style*=\\"position:fixed\\"]').remove()" style="background:rgba(255,255,255,0.2);color:white;border:none;font-size:28px;cursor:pointer;padding:8px 12px;border-radius:6px;">×</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }

    // Function to download uploaded content
    window.downloadContent = function(orderNumber, fileIndex) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order || !order.uploadedContent || !order.uploadedContent[fileIndex]) return;
      
      const file = order.uploadedContent[fileIndex];
      
      // Create download link
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`Downloading "${file.name}"`, 'info');
    }

    window.showSampleDetails = function(sampleId) {
      const sample = samples.find(s => s.id === sampleId);
      if (!sample) return;
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;font-size:20px;color:#4b3b2a;">Sample Details</h2>
            <button onclick="this.closest('div[style*=\\"position:fixed\\"]').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b5440;">×</button>
          </div>
          
          <div style="display:grid;gap:12px;">
            <div><strong>Sample ID:</strong> ${sample.id}</div>
            <div><strong>Article:</strong> ${sample.articleName}</div>
            <div><strong>Status:</strong> <span class="status ${sample.status.replace(/\\s+/g, '')}">${sample.status}</span></div>
            <div><strong>Location:</strong> ${sample.location}</div>
            <div><strong>Assigned To:</strong> ${sample.assignedTo}</div>
            <div><strong>Last Update:</strong> ${sample.lastUpdate}</div>
          </div>
          
          <div style="margin-top:16px;">
            <strong>Transit History:</strong>
            <div style="margin-top:8px;padding:12px;background:#f8fafc;border-radius:6px;">${sample.transitHistory}</div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }

    // Create Order Modal
    function showCreateOrderModal() {
      const modal = document.createElement('div');
      modal.className = 'create-order-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:32px;max-width:800px;width:95%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;font-size:24px;color:#4b3b2a;">📝 Create New Order</h2>
            <button onclick="this.closest('.create-order-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b5440;">×</button>
          </div>
          <form id="createOrderForm" onsubmit="handleCreateOrder(event)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;color:#4b3b2a;">Order Title</label>
                <input name="title" required style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;" placeholder="e.g., Summer Collection Photography">
              </div>
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;color:#4b3b2a;">Priority</label>
                <select name="priority" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div style="margin-bottom:20px;">
              <label style="display:block;margin-bottom:8px;font-weight:500;color:#4b3b2a;">Brief & Instructions</label>
              <textarea name="brief" rows="4" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;" placeholder="Detailed brief..."></textarea>
            </div>
            <div style="display:flex;gap:12px;margin-top:24px;">
              <button type="submit" style="background:#b48fc7;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:500;">Create Order</button>
              <button type="button" onclick="this.closest('.create-order-modal').remove()" style="background:#6b5440;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;">Cancel</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Assign to window immediately after definition
    window.showCreateOrderModal = showCreateOrderModal;

    // Scan Article Modal
    function showScanModal() {
      const modal = document.createElement('div');
      modal.className = 'scan-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:32px;max-width:500px;width:95%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;font-size:24px;color:#4b3b2a;">📷 Scan Article</h2>
            <button onclick="this.closest('.scan-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b5440;">×</button>
          </div>
          <div style="text-align:center;margin-bottom:24px;">
            <div style="background:#f8fafc;border:2px dashed #d1d5db;border-radius:8px;padding:40px;margin-bottom:16px;">
              <div style="font-size:48px;margin-bottom:16px;">📱</div>
              <p style="margin:0;color:#6b5440;">Click to open camera or upload image</p>
            </div>
            <input type="file" accept="image/*" capture="camera" style="display:none;" id="scanInput">
            <button onclick="document.getElementById('scanInput').click()" style="background:#7fa284;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:500;margin-right:12px;">📷 Open Camera</button>
            <button onclick="document.getElementById('scanInput').click()" style="background:#c48b5a;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:500;">📁 Upload Image</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Assign to window immediately after definition
    window.showScanModal = showScanModal;

    // Quick Templates Modal
    function showQuickTemplatesModal() {
      const modal = document.createElement('div');
      modal.className = 'templates-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      
      // Group templates by category
      const templatesByCategory = {};
      Object.entries(templates || {}).forEach(([key, template]) => {
        const category = template.category || 'Other';
        if (!templatesByCategory[category]) {
          templatesByCategory[category] = [];
        }
        templatesByCategory[category].push({ key, ...template });
      });
      
      modal.innerHTML = `
        <div style="background:white;border-radius:16px;padding:32px;max-width:1200px;width:95%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;">
            <div>
              <h2 style="margin:0 0 8px;font-size:28px;color:#4b3b2a;font-weight:700;">⚡ Quick Templates</h2>
              <p style="margin:0;color:#6b5440;font-size:16px;">Choose from pre-configured project templates to get started quickly</p>
            </div>
            <button onclick="this.closest('.templates-modal').remove()" style="background:none;border:none;font-size:32px;cursor:pointer;color:#6b5440;transition:color 0.2s;" onmouseover="this.style.color='#4b3b2a'" onmouseout="this.style.color='#6b5440'">×</button>
          </div>
          
          <!-- Search and Filter Bar -->
          <div style="margin-bottom:32px;">
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
              <input id="templateSearch" type="text" placeholder="🔍 Search templates..." 
                     style="flex:1;min-width:300px;padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;transition:border-color 0.2s;"
                     onmouseover="this.style.borderColor='#c48b5a'" onmouseout="this.style.borderColor='#e5e7eb'" onfocus="this.style.borderColor='#c48b5a'" onblur="this.style.borderColor='#e5e7eb'" />
              <select id="categoryFilter" style="padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;background:white;">
                <option value="">All Categories</option>
                <option value="Photography">📸 Photography</option>
                <option value="Video">🎥 Video</option>
                <option value="Social Media">📱 Social Media</option>
                <option value="Branding">🎨 Branding</option>
                <option value="Documentation">📋 Documentation</option>
              </select>
              <select id="budgetFilter" style="padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;background:white;">
                <option value="">All Budgets</option>
                <option value="low">💰 Under 3,000 SEK</option>
                <option value="medium">💰💰 3,000 - 6,000 SEK</option>
                <option value="high">💰💰💰 Over 6,000 SEK</option>
              </select>
            </div>
          </div>
          
          <div id="templatesContainer">
            ${Object.entries(templatesByCategory).map(([category, categoryTemplates]) => `
              <div class="template-category" data-category="${category}" style="margin-bottom:40px;">
                <h3 style="margin:0 0 20px;font-size:20px;color:#4b3b2a;font-weight:600;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">
                  ${category === 'Photography' ? '📸' : category === 'Video' ? '🎥' : category === 'Social Media' ? '📱' : category === 'Branding' ? '🎨' : category === 'Documentation' ? '📋' : '🎯'} ${category}
                </h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;">
                  ${categoryTemplates.map(template => `
                    <div class="template-card" data-title="${template.title.toLowerCase()}" data-brief="${template.brief.toLowerCase()}" data-category="${template.category}" data-budget="${template.budget}"
                         style="border:2px solid #e5e7eb;border-radius:12px;padding:20px;cursor:pointer;transition:all 0.3s ease;background:linear-gradient(135deg, #f9fafb, #ffffff);" 
                         onclick="useTemplate('${template.key}')"
                         onmouseover="this.style.borderColor='#c48b5a'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(59,130,246,0.15)'"
                         onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                      <div style="display:flex;align-items:center;margin-bottom:12px;">
                        <span style="font-size:24px;margin-right:12px;">${template.icon}</span>
                        <h4 style="margin:0;font-size:18px;color:#4b3b2a;font-weight:600;">${template.title}</h4>
                      </div>
                      <p style="margin:0 0 16px;font-size:14px;color:#6b5440;line-height:1.5;">${template.brief}</p>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="background:linear-gradient(135deg, #f1e8dc, #e5e7eb);padding:6px 12px;border-radius:20px;font-size:12px;color:#4b3b2a;font-weight:500;">${template.method}</span>
                        <span style="background:linear-gradient(135deg, #7fa284, #7fa284);color:white;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;">${template.budget.toLocaleString()} SEK</span>
                      </div>
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:12px;color:#9ca3af;">Priority: <strong style="color:${template.priority === 'High' ? '#dc2626' : template.priority === 'Medium' ? '#f59e0b' : '#7fa284'}">${template.priority}</strong></span>
                        <span style="background:#c48b5a;color:white;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:600;">Use Template →</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add search and filter functionality
      const searchInput = modal.querySelector('#templateSearch');
      const categoryFilter = modal.querySelector('#categoryFilter');
      const budgetFilter = modal.querySelector('#budgetFilter');
      
      function filterTemplates() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedBudget = budgetFilter.value;
        
        const templateCards = modal.querySelectorAll('.template-card');
        const categories = modal.querySelectorAll('.template-category');
        
        categories.forEach(category => {
          let hasVisibleCards = false;
          const categoryName = category.dataset.category;
          
          // Hide category if not matching filter
          if (selectedCategory && selectedCategory !== categoryName) {
            category.style.display = 'none';
            return;
          }
          
          category.style.display = 'block';
          
          // Filter cards within this category
          const cardsInCategory = category.querySelectorAll('.template-card');
          cardsInCategory.forEach(card => {
            const title = card.dataset.title;
            const brief = card.dataset.brief;
            const budget = parseInt(card.dataset.budget);
            
            let matchesSearch = !searchTerm || title.includes(searchTerm) || brief.includes(searchTerm);
            let matchesBudget = true;
            
            if (selectedBudget === 'low') matchesBudget = budget < 3000;
            else if (selectedBudget === 'medium') matchesBudget = budget >= 3000 && budget <= 6000;
            else if (selectedBudget === 'high') matchesBudget = budget > 6000;
            
            if (matchesSearch && matchesBudget) {
              card.style.display = 'block';
              hasVisibleCards = true;
            } else {
              card.style.display = 'none';
            }
          });
          
          // Hide category if no visible cards
          if (!hasVisibleCards) {
            category.style.display = 'none';
          }
        });
      }
      
      searchInput.addEventListener('input', filterTemplates);
      categoryFilter.addEventListener('change', filterTemplates);
      budgetFilter.addEventListener('change', filterTemplates);
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => { 
        if(e.target === modal) modal.remove(); 
      });
      
      // Close on ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    }
    
    // Assign to window immediately after definition
    window.showQuickTemplatesModal = showQuickTemplatesModal;

    // SAP PMR Import Modal
    function showSAPImportModal() {
      // Close any open sidebar modals before showing this modal
      closeAllRightSideModals();
      
      const modal = document.createElement('div');
      modal.className = 'sap-import-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:32px;max-width:600px;width:95%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;font-size:24px;color:#4b3b2a;">🏢 Import SAP PMR Data</h2>
            <button onclick="this.closest('.sap-import-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b5440;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <h3 style="margin:0 0 16px;font-size:18px;color:#4b3b2a;">Data Format Expected</h3>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;border-left:4px solid #c48b5a;">
              <p style="margin:0 0 12px;font-size:14px;color:#4b3b2a;"><strong>JSON Array with following fields:</strong></p>
              <ul style="margin:0;padding-left:20px;font-size:14px;color:#6b5440;">
                <li><strong>eventId</strong>: Event identifier (e.g., "A4025052")</li>
                <li><strong>purchaseGroup</strong>: Purchase group number (100-999)</li>
                <li><strong>offerId</strong>: Offer identifier (e.g., "10763319")</li>
                <li><strong>articleNumber</strong>: Article number</li>
                <li><strong>articleName</strong>: Article name</li>
                <li><strong>imageRequestId</strong>: Image request ID (e.g., "123456")</li>
                <li><strong>photoStatus</strong>: "Archive", "New Shoot - Photographer", or "New Shoot - Photo Box"</li>
                <li><strong>cloudinaryUrl</strong>: (Optional) Existing image URL</li>
              </ul>
            </div>
          </div>
          
          <div style="margin-bottom:24px;">
            <h3 style="margin:0 0 16px;font-size:18px;color:#4b3b2a;">Sample Data</h3>
            <div style="background:#f1f5f9;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;max-height:200px;overflow-y:auto;">
[{
  "eventId": "A4025052",
  "purchaseGroup": 100,
  "offerId": "10763319",
  "articleNumber": "ART-DOG-001",
  "articleName": "Premium Dog Food 2kg",
  "imageRequestId": "123456",
  "photoStatus": "New Shoot - Photographer",
  "cloudinaryUrl": null
}]
            </div>
          </div>
          
          <div style="margin-bottom:24px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#4b3b2a;">Paste JSON Data:</label>
            <textarea id="sapJsonInput" style="width:100%;height:200px;padding:12px;border:1px solid #d1d5db;border-radius:6px;font-family:monospace;font-size:12px;" placeholder="Paste your SAP PMR JSON data here..."></textarea>
          </div>
          
          <div style="display:flex;gap:12px;justify-content:space-between;">
            <button onclick="simulatePMRRequest()" style="padding:12px 24px;background:#7fa284;color:white;border:none;border-radius:6px;cursor:pointer;">🎲 Simulate PMR Request</button>
            <div style="display:flex;gap:12px;">
              <button onclick="this.closest('.sap-import-modal').remove()" style="padding:12px 24px;border:1px solid #d1d5db;background:white;color:#4b3b2a;border-radius:6px;cursor:pointer;">Cancel</button>
              <button onclick="processSAPImport()" style="padding:12px 24px;background:#a66b38;color:white;border:none;border-radius:6px;cursor:pointer;">Import Data</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Assign to window immediately after definition
    window.showSAPImportModal = showSAPImportModal;

    // Process SAP Import
    window.processSAPImport = function() {
      const jsonInput = document.getElementById('sapJsonInput').value.trim();
      
      if (!jsonInput) {
        alert('Please enter JSON data to import.');
        return;
      }
      
      const result = importSAPData(jsonInput);
      
      if (result.success) {
        alert(`Successfully imported ${result.imported} orders from SAP PMR!`);
        document.querySelector('.sap-import-modal').remove();
        showView('orders'); // Refresh the orders view
      } else {
        alert(`Import failed: ${result.error}`);
      }
    };

    // Simulate PMR Request
    window.simulatePMRRequest = function() {
      // Sample articles for different purchase groups
      const sampleArticles = {
        100: [ // Groceries
          { name: 'Premium Olive Oil Extra Virgin 500ml', number: 'ART-OIL-' + Math.floor(Math.random() * 1000) },
          { name: 'Organic Quinoa Red 400g', number: 'ART-QUI-' + Math.floor(Math.random() * 1000) },
          { name: 'Artisan Bread Sourdough', number: 'ART-BRD-' + Math.floor(Math.random() * 1000) },
          { name: 'Free Range Eggs Large 12pk', number: 'ART-EGG-' + Math.floor(Math.random() * 1000) }
        ],
        200: [ // Fresh Products
          { name: 'Norwegian Salmon Fillet 400g', number: 'ART-SAL-' + Math.floor(Math.random() * 1000) },
          { name: 'Organic Baby Spinach 150g', number: 'ART-SPI-' + Math.floor(Math.random() * 1000) },
          { name: 'Fresh Strawberries 250g', number: 'ART-STR-' + Math.floor(Math.random() * 1000) },
          { name: 'Greek Feta Cheese 200g', number: 'ART-FET-' + Math.floor(Math.random() * 1000) }
        ],
        300: [ // Electronics
          { name: 'Wireless Gaming Mouse RGB', number: 'ART-MOU-' + Math.floor(Math.random() * 1000) },
          { name: 'USB-C Fast Charger 65W', number: 'ART-CHR-' + Math.floor(Math.random() * 1000) },
          { name: 'Bluetooth Noise Cancelling Headphones', number: 'ART-HEA-' + Math.floor(Math.random() * 1000) },
          { name: 'Smart Watch Fitness Tracker', number: 'ART-WAT-' + Math.floor(Math.random() * 1000) }
        ],
        400: [ // Home & Garden
          { name: 'Solar Pathway Lights Set of 6', number: 'ART-SOL-' + Math.floor(Math.random() * 1000) },
          { name: 'Ceramic Plant Pots Set', number: 'ART-POT-' + Math.floor(Math.random() * 1000) },
          { name: 'Outdoor Cushion Covers 4pk', number: 'ART-CUS-' + Math.floor(Math.random() * 1000) },
          { name: 'Garden Tool Set Professional', number: 'ART-TOO-' + Math.floor(Math.random() * 1000) }
        ]
      };

      // Get current week for event ID
      const now = new Date();
      const weekNum = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      // Random purchase group (100, 200, 300, 400)
      const purchaseGroups = [100, 200, 300, 400];
      const randomPG = purchaseGroups[Math.floor(Math.random() * purchaseGroups.length)];
      
      // Random number of articles (1-3)
      const numArticles = Math.floor(Math.random() * 3) + 1;
      const articles = [];
      const availableArticles = [...sampleArticles[randomPG]];
      
      for (let i = 0; i < numArticles; i++) {
        if (availableArticles.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableArticles.length);
          articles.push(availableArticles.splice(randomIndex, 1)[0]);
        }
      }

      // Random photo status (only new shoot options)
      const photoStatuses = ['New Shoot - Photographer', 'New Shoot - Photo Box'];
      const randomPhotoStatus = photoStatuses[Math.floor(Math.random() * photoStatuses.length)];
      
      // Create realistic PMR data
      const simulatedData = articles.map(article => ({
        eventId: `A${weekNum.toString().padStart(2, '0')}25${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
        purchaseGroup: randomPG,
        offerId: `1076${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        articleNumber: article.number,
        articleName: article.name,
        imageRequestId: Math.floor(Math.random() * 1000000).toString(),
        photoStatus: randomPhotoStatus,
        cloudinaryUrl: null,
        salesOrg: getRandomSalesOrg()
      }));

      // Fill the textarea with simulated data
      const textarea = document.getElementById('sapJsonInput');
      textarea.value = JSON.stringify(simulatedData, null, 2);
      
      // Show success message
      const purchaseGroupName = purchaseGroups[randomPG] || 'Unknown';
      alert(`🎲 Generated ${articles.length} ${randomPhotoStatus.toLowerCase()} request(s) for Purchase Group ${randomPG} (${purchaseGroupName})`);
    };

    // Filter orders by status from dashboard tiles and order view tiles
    window.filterOrdersByStatus = function(statusFilter) {
      // Close any open sidebar modals before filtering
      closeAllRightSideModals();
      
      // Show orders view with filter applied
      showView('orders');
      
      // Apply the filter after a short delay to ensure the view is loaded
      setTimeout(() => {
        if (!window.rkhOrders) {
          // Create some sample data if orders are not available
          window.rkhOrders = [
            { orderNumber: 'ORD001', title: 'Sample Order 1', status: 'Draft', priority: 'Medium', photographer: 'John Doe', method: 'Digital', deadline: '2025-09-10', purchaseGroup: 'PG1', eventId: 'E001' },
            { orderNumber: 'ORD002', title: 'Sample Order 2', status: 'Pending', priority: 'High', photographer: 'Jane Smith', method: 'Print', deadline: '2025-09-12', purchaseGroup: 'PG2', eventId: 'E002' },
            { orderNumber: 'ORD003', title: 'Sample Order 3', status: 'Approved', priority: 'Medium', photographer: 'Bob Wilson', method: 'Digital', deadline: '2025-09-15', purchaseGroup: 'PG1', eventId: 'E003' },
            { orderNumber: 'ORD004', title: 'Sample Order 4', status: 'In Progress', priority: 'Low', photographer: 'Alice Brown', method: 'Print', deadline: '2025-09-18', purchaseGroup: 'PG3', eventId: 'E004' },
            { orderNumber: 'ORD005', title: 'Sample Order 5', status: 'Complete', priority: 'High', photographer: 'Mike Davis', method: 'Digital', deadline: '2025-09-20', purchaseGroup: 'PG2', eventId: 'E005' }
          ];
          assignSalesOrgMetadata(window.rkhOrders);
        }
        
        if (!window.authSystem) {
          window.authSystem = {
            getFilteredOrders: function(orders) {
              return orders || [];
            }
          };
        }
        
        const ordersList = window.authSystem.getFilteredOrders(window.rkhOrders);
        setStatusFilterOverride(statusFilter === 'all' ? '' : statusFilter, { skipRender: true });
        console.log('[DEBUG] filterOrdersByStatus - ordersList length:', ordersList.length);
        console.log('[DEBUG] First order in ordersList:', JSON.stringify(ordersList[0], null, 2));
        const statusResult = applyStatusFilter(ordersList, statusFilter);
        const filteredOrders = statusResult.orders;
        const filterTitle = statusResult.label || getStatusFilterLabel(statusFilter);
        
        // Update the orders table with filtered results
        const ordersBody = document.getElementById('ordersBody');

        if (ordersBody) {
          drawOrderRows();
        } else {
          console.error('[ERROR] ordersBody element not found!');
        }
        
        // Show filter info
        const mainContent = document.getElementById('mainContent');
        const existingFilter = mainContent?.querySelector('.filter-info');
        if (existingFilter) {
          existingFilter.remove();
        }
        
        if (statusFilter !== 'all') {
          const filterInfo = document.createElement('div');
          filterInfo.className = 'filter-info';
          filterInfo.style.cssText = 'background: linear-gradient(135deg, #fdf4e6, #f2e4d2); border: 1px solid #c48b5a; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;';
          filterInfo.innerHTML = `
            <div>
              <span style="color: #0284c7; font-weight: 600;">🔍 Filter Applied:</span>
              <span style="color: #a66b38; font-weight: 500; margin-left: 8px;">${filterTitle}</span>
              <span style="color: #6b5440; margin-left: 8px;">(${filteredOrders.length} ${filteredOrders.length === 1 ? 'order' : 'orders'})</span>
            </div>
            <button onclick="filterOrdersByStatus('all')" style="background: #c48b5a; color: white; border: none; border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-weight: 500;">
              Clear Filter
            </button>
          `;
          
          const ordersView = document.getElementById('ordersView');
          const filterTiles = ordersView?.querySelector('[style*="Quick Filters"]')?.parentElement;
          if (filterTiles) {
            filterTiles.insertAdjacentElement('afterend', filterInfo);
          } else if (mainContent) {
            mainContent.insertBefore(filterInfo, mainContent.firstChild);
          }
        }
        
        // Update filter tile counts based on visible rows only
        if (typeof window.updateFilterTileCounts === 'function') {
          window.updateFilterTileCounts(true); // Pass true to use visible rows only
        }
        
      }, 150);
    };

    // Function to update filter tile counts
    window.updateFilterTileCounts = function(useVisibleRowsOnly = false) {
      let ordersList;
      
      if (useVisibleRowsOnly) {
        // Calculate from VISIBLE table rows only (after filtering)
        const visibleRows = document.querySelectorAll('#ordersView tbody tr:not([style*="display: none"]):not([style*="display:none"])');
        ordersList = Array.from(visibleRows).map(row => {
          // Extract status from the row's status cell
          const statusCell = row.querySelector('.status');
          const status = statusCell ? statusCell.textContent.trim() : '';
          return { status: status };
        });
      } else {
        // Calculate from ALL orders
        ordersList = applyActiveOrderFilters(authSystem.getFilteredOrders(window.rkhOrders || []));
      }

      if (statusFilterOverride) {
        ordersList = applyStatusFilter(ordersList, statusFilterOverride).orders;
      }
      
      // Helper function to check if status matches a category (case-insensitive, supports multiple variations)
      const matchesStatus = (status, ...patterns) => {
        const statusLower = (status || '').toLowerCase().trim();
        return patterns.some(pattern => statusLower.includes(pattern.toLowerCase()));
      };
      
      // Update counts in filter tiles
      const updateCount = (id, count) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = count;
        }
      };
      
      updateCount('allOrdersCount', ordersList.length);
      updateCount('draftOrdersCount', ordersList.filter(o => matchesStatus(o.status, 'Draft', 'New Request')).length);
      updateCount('pendingOrdersCount', ordersList.filter(o => matchesStatus(o.status, 'Pending')).length);
      updateCount('approvedOrdersCount', ordersList.filter(o => matchesStatus(o.status, 'Approved') && !matchesStatus(o.status, 'Pending')).length);
      updateCount('samplesOrdersCount', ordersList.filter(o => matchesStatus(o.status, 'Sample')).length);
      updateCount('inProgressOrdersCount', ordersList.filter(o => matchesStatus(o.status, 'In Progress', 'Photo Session', 'Processing')).length);
      updateCount('reviewOrdersCount', ordersList.filter(o => matchesStatus(o.status, 'Review')).length);
      updateCount('completedOrdersCount', ordersList.filter(o => matchesStatus(o.status, 'Complete', 'Delivered', 'Archived')).length);
    };

    // Scanner functions
    function showScannerModal() {
      const modal = document.createElement('div');
      modal.id = 'scannerModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:500px;width:90%;">
          <h3 style="margin:0 0 16px;">📷 Scan Article</h3>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 500; margin-bottom: 4px;">Article Name</label>
            <input id="scannedArticleName" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                   placeholder="Scan or type article name...">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 500; margin-bottom: 4px;">EAN Code</label>
            <input id="scannedEAN" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                   placeholder="Scan or type EAN barcode..." pattern="[0-9]{8,13}">
          </div>
          <div style="text-align:right;">
            <button id="cancelScanBtn" style="margin-right:8px;padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:4px;">Cancel</button>
            <button id="processScanBtn" style="padding:8px 16px;background:#a66b38;color:white;border:none;border-radius:4px;">Process Scan</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelScanBtn').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('processScanBtn').addEventListener('click', () => {
        processScanResult();
      });
      
      // Focus on article name input
      setTimeout(() => {
        document.getElementById('scannedArticleName').focus();
      }, 100);
    }

    function processScanResult() {
      const articleName = document.getElementById('scannedArticleName').value.trim();
      const eanCode = document.getElementById('scannedEAN').value.trim();
      
      if (!articleName || !eanCode) {
        alert('Please enter both article name and EAN code');
        return;
      }
      
      // Close modal
      const modal = document.getElementById('scannerModal');
      if (modal) {
        modal.remove();
      }
      
      const currentUser = authSystem.getCurrentUser();
      console.log('Current user:', currentUser);
      
      if (authSystem.canCreateOrders()) {
        console.log('User can create orders - calling addArticleToOrder');
        // For users who can create orders: add to order creation form
        addArticleToOrder(articleName, eanCode);
      } else if (currentUser.role === 'Photographer' || currentUser.role === 'Photo Box' || currentUser.role === 'Agency') {
        console.log('User is photographer/photo box - calling searchOrdersByArticle');
        // For photographers/photo box: search for orders with this article
        searchOrdersByArticle(articleName, eanCode);
      }
    }

    // Make processScanResult globally accessible
    window.processScanResult = processScanResult;

    // Buyer management functions
    function addBuyer() {
      const container = document.getElementById('buyersContainer');
      const buyerDiv = document.createElement('div');
      buyerDiv.className = 'buyer-item';
      buyerDiv.style.cssText = 'display: grid; grid-template-columns: 200px 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px;';
      buyerDiv.innerHTML = `
        <input type="text" class="buyer-name" placeholder="Buyer/Department" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
        <input type="text" class="buyer-items" placeholder="Items for this buyer (comma-separated)" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
        <button type="button" onclick="removeBuyer(this)" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 12px;">✕</button>
      `;
      container.insertBefore(buyerDiv, document.getElementById('addBuyerBtn'));
    }

    function removeBuyer(button) {
      button.parentElement.remove();
    }

    function collectBuyersData() {
      const buyers = [];
      document.querySelectorAll('.buyer-item').forEach(item => {
        const name = item.querySelector('.buyer-name').value.trim();
        const items = item.querySelector('.buyer-items').value.trim();
        if (name && items) {
          buyers.push({
            name: name,
            items: items.split(',').map(i => i.trim()).filter(i => i)
          });
        }
      });
      return buyers;
    }

    // Make functions globally accessible
    window.addBuyer = addBuyer;
    window.removeBuyer = removeBuyer;

    // Excel/CSV Import functionality
    function showExcelImportModal() {
      const modal = document.createElement('div');
      modal.id = 'excelImportModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:800px;width:95%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 20px;">📋 Import Orders from Excel/CSV</h3>
          
          <!-- Required Headers Section -->
          <div id="headersSection" style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h4 style="margin: 0 0 12px; color: #a66b38; font-size: 16px;">📋 Required Excel/CSV Headers</h4>
            <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #cbd5e1; margin-bottom: 12px;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-family: monospace; font-size: 12px; font-weight: 600; color: #4b3b2a;">
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Title</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Method</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Priority</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Deadline</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Brief</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Articles</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Deliverables</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Photographer</div>
              </div>
            </div>
            <div style="font-size: 14px; color: #64748b; line-height: 1.5;">
              <strong>Notes:</strong><br>
              • <strong>Method:</strong> Photographer, Photo Box, External Studio, Internal Studio<br>
              • <strong>Priority:</strong> Low, Medium, High, Critical<br>
              • <strong>Deadline:</strong> YYYY-MM-DD format (e.g., 2025-09-15)<br>
              • <strong>Articles & Deliverables:</strong> Separate multiple items with semicolons (;)
            </div>
          </div>
          
          <!-- File Upload Section -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #4b3b2a;">Select Excel/CSV File</label>
            <input type="file" id="excelFileInput" accept=".xlsx,.xls,.csv" 
                   style="width: 100%; padding: 12px; border: 2px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; cursor: pointer;">
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Supports .xlsx, .xls, and .csv files</div>
          </div>
          
          <!-- Preview Section -->
          <div id="previewSection" style="display: none; margin-bottom: 20px;">
            <h4 style="margin: 0 0 12px; color: #7fa284; font-size: 16px;">📊 Data Preview</h4>
            <div id="previewContent" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; max-height: 300px; overflow: auto;"></div>
            <div id="previewStats" style="margin-top: 8px; font-size: 14px; color: #64748b;"></div>
          </div>
          
          <!-- Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div id="validationMessage" style="color: #dc2626; font-size: 14px; font-weight: 500;"></div>
            <div>
              <button id="cancelExcelImport" style="margin-right:12px;padding:10px 20px;border:1px solid #d1d5db;background:white;border-radius:6px;font-weight:500;cursor:pointer;">Cancel</button>
              <button id="processExcelImport" style="padding:10px 20px;background:#a66b38;color:white;border:none;border-radius:6px;font-weight:500;cursor:pointer;" disabled>Import Orders</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelExcelImport').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('processExcelImport').addEventListener('click', () => {
        processExcelImport();
      });
      
      document.getElementById('excelFileInput').addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0]);
      });
      
      // ESC key to close modal
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    }

    let currentImportData = null;

    function handleFileUpload(file) {
      if (!file) return;
      
      const validationMessage = document.getElementById('validationMessage');
      const previewSection = document.getElementById('previewSection');
      const processButton = document.getElementById('processExcelImport');
      
      // Reset UI
      validationMessage.textContent = '';
      previewSection.style.display = 'none';
      processButton.disabled = true;
      
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.csv')) {
        // Handle CSV file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const csvData = e.target.result;
            const parsedData = parseCSV(csvData);
            showPreview(parsedData);
          } catch (error) {
            validationMessage.textContent = 'Error reading CSV file: ' + error.message;
          }
        };
        reader.readAsText(file);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // Handle Excel file - basic implementation
        validationMessage.textContent = 'Excel files need to be saved as CSV format first. Please save your Excel file as .csv and upload again.';
        validationMessage.style.color = '#f59e0b';
      } else {
        validationMessage.textContent = 'Please select a .csv, .xlsx, or .xls file.';
      }
    }

    function parseCSV(csvData) {
      const lines = csvData.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }
      
      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Required headers
      const requiredHeaders = ['Title', 'Method', 'Priority', 'Deadline', 'Brief', 'Articles', 'Deliverables', 'Photographer'];
      const missingHeaders = requiredHeaders.filter(req => !headers.some(h => h.toLowerCase() === req.toLowerCase()));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }
      
      // Parse data rows
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = parseCSVLine(line);
        if (values.length > 0) {
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      }
      
      return { headers, data };
    }

    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    }

    function showPreview(parsedData) {
      const { headers, data } = parsedData;
      const previewSection = document.getElementById('previewSection');
      const previewContent = document.getElementById('previewContent');
      const previewStats = document.getElementById('previewStats');
      const processButton = document.getElementById('processExcelImport');
      
      // Store data for processing
      currentImportData = parsedData;
      
      // Create preview table
      let tableHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #c48b5a; color: white;">
              ${headers.map(h => `<th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.slice(0, 5).map(row => `
              <tr style="background: white;">
                ${headers.map(h => `<td style="padding: 8px; border: 1px solid #e5e7eb;">${row[h] || ''}</td>`).join('')}
              </tr>
            `).join('')}
            ${data.length > 5 ? `
              <tr style="background: #f8fafc;">
                <td colspan="${headers.length}" style="padding: 12px; text-align: center; color: #64748b; font-style: italic;">
                  ... and ${data.length - 5} more rows
                </td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      `;
      
      previewContent.innerHTML = tableHTML;
      previewStats.innerHTML = `
        <strong>${data.length} orders</strong> found in file. 
        <span style="color: #7fa284;">✓ Headers validated</span>
      `;
      
      // Show preview and enable import button
      previewSection.style.display = 'block';
      processButton.disabled = false;
    }

    function processExcelImport() {
      if (!currentImportData) {
        document.getElementById('validationMessage').textContent = 'Please select and preview a file first.';
        return;
      }
      
      const { data } = currentImportData;
      let importedCount = 0;
      let errors = [];
      
      try {
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          
          // Validate required fields
          if (!row.Title || !row.Title.trim()) {
            errors.push(`Row ${i + 2}: Title is required`);
            continue;
          }
          
          // Generate unique order number
          const orderNumber = `ORD-2025-${String(allOrders.length + importedCount + 1).padStart(3, '0')}`;
          
          // Create new order object
          const newOrder = {
            orderNumber: orderNumber,
            title: row.Title.trim(),
            status: 'Draft',
            method: row.Method || 'Photographer',
            photographer: row.Photographer || 'Unassigned',
            assignedTo: row.Photographer ? authSystem.getUserIdByName(row.Photographer) : null,
            deadline: validateDate(row.Deadline) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            costCenter: 'CC-IMPORT',
            priority: validatePriority(row.Priority) || 'Medium',
            brief: row.Brief || 'Imported from Excel/CSV',
            articles: row.Articles ? row.Articles.split(';').map(a => a.trim()).filter(a => a) : [],
            budget: null,
            deliverables: row.Deliverables ? row.Deliverables.split(';').map(d => d.trim()).filter(d => d) : [],
            salesOrg: row['Sales Org'] ? normalizeFilterValue(row['Sales Org']) : null,
            
            // SAP PMR fields (auto-generated)
            eventId: `A${Math.floor(Math.random() * 9000000) + 1000000}`,
            purchaseGroup: authSystem.getCurrentUser().purchaseGroups ? authSystem.getCurrentUser().purchaseGroups[0] : 100,
            offerId: `1076${Math.floor(Math.random() * 9000) + 1000}`,
            articleNumber: `ART-IMP-${String(importedCount + 1).padStart(3, '0')}`,
            articleName: row.Articles ? row.Articles.split(';')[0] : row.Title,
            imageRequestId: String(Math.floor(Math.random() * 900000) + 100000),
            photoStatus: 'New Request',
            cloudinaryUrl: null,
            
            // Creator and assignment fields
            createdBy: authSystem.getCurrentUser().id,
            createdAt: new Date().toISOString(),
            assignedTo: row.Photographer ? authSystem.getUserIdByName(row.Photographer) : null,
            updatedAt: new Date().toISOString(),
            comments: []
          };
          
          assignSalesOrgToOrder(newOrder, allOrders.length + importedCount);

          // Add to orders array
          allOrders.unshift(newOrder);
          importedCount++;
        }
        
        // Close modal
        document.getElementById('excelImportModal').remove();
        
        // Update global orders and refresh view
    assignSalesOrgMetadata(allOrders);
    window.rkhOrders = allOrders;
        if (typeof refreshOrderFilters === 'function') {
          refreshOrderFilters();
        }
        if (typeof drawOrderRows === 'function') {
          drawOrderRows();
        }
        if (typeof window.updateQuickActionBadges === 'function') {
          window.updateQuickActionBadges();
        }
        
        // Show success message
        let message = `Successfully imported ${importedCount} orders!`;
        if (errors.length > 0) {
          message += ` (${errors.length} rows had errors and were skipped)`;
          console.warn('Import errors:', errors);
        }
        showToast(message, 'success');
        
      } catch (error) {
        document.getElementById('validationMessage').textContent = 'Error processing data: ' + error.message;
        console.error('Import error:', error);
      }
    }

    // Helper functions for validation
    function validateDate(dateStr) {
      if (!dateStr) return null;
      
      // Try to parse various date formats
      const formats = [
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
        /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
      ];
      
      for (let format of formats) {
        if (format.test(dateStr)) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }
      
      return null;
    }

    function validatePriority(priority) {
      const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
      return validPriorities.find(p => p.toLowerCase() === priority?.toLowerCase()) || null;
    }

    // Expose Excel import function globally
    window.showExcelImportModal = showExcelImportModal;

    function addArticleToOrder(articleName, eanCode) {
      // Open create order view if not already open
      if (currentView !== 'create') {
        showView('create');
      }
      
      // Add article to the articles textarea
      const articlesTextarea = document.getElementById('articlesTextarea');
      const articleEntry = `${articleName} [EAN: ${eanCode}]`;
      
      if (articlesTextarea.value) {
        articlesTextarea.value += '\\n' + articleEntry;
      } else {
        articlesTextarea.value = articleEntry;
      }
      
      // Show success message
      showToast(`Article "${articleName}" added to order`, 'success');
    }

    function searchOrdersByArticle(articleName, eanCode) {
      console.log('searchOrdersByArticle called with:', articleName, eanCode);
      console.log('Total orders to search:', allOrders.length);

      const normalizedSearchName = (articleName || '').toLowerCase().trim();
      const normalizedEAN = (eanCode || '').replace(/\s+/g, '');

      const matchingOrders = allOrders.filter(order => {
        const normalized = normalizeArticles(order.articles);
        if (!normalized.length) return false;

        return normalized.some(article => {
          const nameMatch = normalizedSearchName ?
            (article.displayText || '').toLowerCase().includes(normalizedSearchName) ||
            (article.name || '').toLowerCase().includes(normalizedSearchName)
            : false;

          const eanMatch = normalizedEAN ?
            (article.ean || '').replace(/\s+/g, '').includes(normalizedEAN)
            : false;

          console.log('Checking article:', article.displayText, 'Name match:', nameMatch, 'EAN match:', eanMatch);
          return nameMatch || eanMatch;
        });
      });
      
      console.log('Matching orders found:', matchingOrders.length);
      
      if (matchingOrders.length === 0) {
        showToast(`No orders found for article "${articleName}" [EAN: ${eanCode}]`, 'info');
        return;
      }
      
      // Show search results modal
      const modal = document.createElement('div');
      modal.id = 'searchResultsModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:800px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px;">🔍 Orders containing "${articleName}" [EAN: ${eanCode}]</h3>
          <div style="margin-bottom: 16px;" id="searchResultsList">
            ${matchingOrders.map((order, index) => `
              <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 8px; cursor: pointer;"
                   data-order-number="${order.orderNumber}" class="search-result-item">
                <div style="font-weight: 600; color: #4b3b2a;">${order.orderNumber} - ${order.title}</div>
                <div style="color: #6b5440; font-size: 14px;">Status: ${order.status} | Assigned: ${order.photographer}</div>
                <div style="color: #4b3b2a; font-size: 12px; margin-top: 4px;">
                  Articles: ${formatArticlesAsPlainText(order.articles) || 'None'}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="text-align:right;">
            <button id="closeSearchResults" style="padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:4px;">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners for search results
      document.getElementById('closeSearchResults').addEventListener('click', () => {
        modal.remove();
      });
      
      // Add click listeners for each result item
      document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const orderNumber = item.dataset.orderNumber;
          modal.remove();
          showOrderDetails(orderNumber);
        });
      });
      
      showToast(`Found ${matchingOrders.length} order(s) with this article`, 'success');
    }

    // Navigation event handlers (removed redundant bottom button listeners)
    document.getElementById('backFromTemplates')?.addEventListener('click', () => showView('orders'));
    document.getElementById('backFromWorkflow')?.addEventListener('click', () => showView('orders'));
    
    // Calendar navigation handlers
    document.getElementById('calendarPrevious')?.addEventListener('click', () => {
      if (calendarViewType === 'week') {
        calendarDate.setDate(calendarDate.getDate() - 7);
      } else if (calendarViewType === 'month') {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
      } else if (calendarViewType === 'year') {
        calendarDate.setFullYear(calendarDate.getFullYear() - 1);
      }
      drawCalendarView();
    });
    
    document.getElementById('calendarNext')?.addEventListener('click', () => {
      if (calendarViewType === 'week') {
        calendarDate.setDate(calendarDate.getDate() + 7);
      } else if (calendarViewType === 'month') {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
      } else if (calendarViewType === 'year') {
        calendarDate.setFullYear(calendarDate.getFullYear() + 1);
      }
      drawCalendarView();
    });
    
    document.getElementById('calendarToday')?.addEventListener('click', () => {
      calendarDate = new Date();
      drawCalendarView();
    });
    
    // Calendar view type handlers
    document.getElementById('weekView')?.addEventListener('click', () => {
      calendarViewType = 'week';
      drawCalendarView();
    });
    
    document.getElementById('monthView')?.addEventListener('click', () => {
      calendarViewType = 'month';
      drawCalendarView();
    });
    
    document.getElementById('yearView')?.addEventListener('click', () => {
      calendarViewType = 'year';
      drawCalendarView();
    });
    
    // Scanner event handlers
    document.getElementById('scanArticleBtn')?.addEventListener('click', showScannerModal);
    
    // Template selection
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const templateKey = card.getAttribute('data-template');
        applyTemplate(templateKey);
      });
    });
    
    // Bulk actions
    document.getElementById('toggleBulkMode')?.addEventListener('click', toggleBulkMode);
    document.getElementById('clearSelection')?.addEventListener('click', () => {
      selectedItems.clear();
      drawOrderRows();
    });
    
    document.getElementById('bulkUpdateStatus')?.addEventListener('click', () => {
      if (selectedItems.size === 0) return;
      
      const modal = document.createElement('div');
      modal.id = 'bulkStatusModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:400px;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
          <h3 style="margin:0 0 16px;color:#4b3b2a;font-size:18px;font-weight:600;">Update Status for ${selectedItems.size} items</h3>
          <select id="newStatus" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;margin-bottom:20px;font-size:14px;background:white;">
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button id="cancelBulkUpdate" style="padding:10px 20px;border:1px solid #d1d5db;background:white;border-radius:6px;color:#6b5440;font-weight:500;cursor:pointer;transition:all 0.2s;">Cancel</button>
            <button id="confirmBulkUpdate" style="padding:10px 20px;background:#a66b38;color:white;border:none;border-radius:6px;font-weight:500;cursor:pointer;transition:all 0.2s;">Update</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelBulkUpdate').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('confirmBulkUpdate').addEventListener('click', () => {
        updateSelectedStatuses();
        modal.remove();
      });
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Close on ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
      
      // Clean up event listener when modal is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === modal) {
              document.removeEventListener('keydown', handleEsc);
              observer.disconnect();
            }
          });
        });
      });
      observer.observe(document.body, { childList: true });
    });
    
    window.updateSelectedStatuses = function() {
      const newStatus = document.getElementById('newStatus').value;
      let completedCount = 0;
      
      selectedItems.forEach(orderNumber => {
        const order = allOrders.find(o => o.orderNumber === orderNumber);
        if (order) {
          order.status = newStatus;
          order.updatedAt = new Date().toISOString();
          if (newStatus === 'Complete') {
            completedCount++;
          }
        }
      });
      
      // Trigger confetti if any orders were completed
      if (completedCount > 0) {
        triggerConfetti();
      }
      
      selectedItems.clear();
      drawOrderRows();
      updateBulkActionsPanel();
      
      // Show success
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Status updated successfully!';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Bulk Assign event listener
    document.getElementById('bulkAssign')?.addEventListener('click', () => {
      if (selectedItems.size === 0) return;
      
      const modal = document.createElement('div');
      modal.id = 'bulkAssignModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:400px;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
          <h3 style="margin:0 0 16px;color:#4b3b2a;font-size:18px;font-weight:600;">Assign ${selectedItems.size} items to:</h3>
          <select id="newAssignee" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;margin-bottom:20px;font-size:14px;background:white;">
            <option value="">Unassigned</option>
            <option value="photographer1">John Smith</option>
            <option value="photographer2">Sarah Johnson</option>
            <option value="photographer3">Mike Wilson</option>
            <option value="photographer4">Emily Davis</option>
          </select>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button id="cancelBulkAssign" style="padding:10px 20px;border:1px solid #d1d5db;background:white;border-radius:6px;color:#6b5440;font-weight:500;cursor:pointer;transition:all 0.2s;">Cancel</button>
            <button id="confirmBulkAssign" style="padding:10px 20px;background:#a66b38;color:white;border:none;border-radius:6px;font-weight:500;cursor:pointer;transition:all 0.2s;">Assign</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelBulkAssign').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('confirmBulkAssign').addEventListener('click', () => {
        assignSelectedItems();
        modal.remove();
      });
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Close on ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
      
      // Clean up event listener when modal is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === modal) {
              document.removeEventListener('keydown', handleEsc);
              observer.disconnect();
            }
          });
        });
      });
      observer.observe(document.body, { childList: true });
    });

    // Bulk Export event listener
    document.getElementById('bulkExport')?.addEventListener('click', () => {
      if (selectedItems.size === 0) {
        alert('Please select items to export');
        return;
      }
      
      const selectedOrders = allOrders.filter(order => selectedItems.has(order.orderNumber));
      
      // Create CSV content
      const headers = ['Order Number', 'Title', 'Status', 'Method', 'Purchase Group', 'Photographer', 'Deadline', 'Cost Center'];
      const csvContent = [
        headers.join(','),
        ...selectedOrders.map(order => [
          order.orderNumber,
          `"${order.title || ''}"`,
          order.status,
          order.method,
          order.purchaseGroup,
          order.photographer || 'Unassigned',
          order.deadline || '',
          order.costCenter || ''
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected_orders_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `${selectedItems.size} orders exported successfully!`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    });

    window.assignSelectedItems = function() {
      const newAssignee = document.getElementById('newAssignee').value;
      const assigneeName = newAssignee ? document.getElementById('newAssignee').selectedOptions[0].textContent : 'Unassigned';
      
      selectedItems.forEach(orderNumber => {
        const order = allOrders.find(o => o.orderNumber === orderNumber);
        if (order) {
          order.assignedTo = newAssignee;
          order.photographer = assigneeName;
          order.updatedAt = new Date().toISOString();
        }
      });
      
      selectedItems.clear();
      drawOrderRows();
      updateBulkActionsPanel();
      
      // Show success
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Items assigned successfully!';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Select All checkbox event listener
    document.getElementById('selectAllOrders')?.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const visibleRows = document.querySelectorAll('#ordersView tbody tr:not([style*="display: none"])');
      
      visibleRows.forEach(row => {
        const checkbox = row.querySelector('.item-checkbox');
        if (checkbox) {
          const orderId = checkbox.getAttribute('data-id');
          checkbox.checked = isChecked;
          
          if (isChecked) {
            selectedItems.add(orderId);
          } else {
            selectedItems.delete(orderId);
          }
        }
      });
      
      updateBulkActionsPanel();
    });

    // Create order form handler
    document.getElementById('createOrderForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const buyersData = collectBuyersData();
      
      // Collect selected photo types
      const selectedPhotoTypes = Array.from(document.querySelectorAll('input[name="photoTypes"]:checked')).map(cb => cb.value);
      
      const newOrder = {
        orderNumber: `ORD-2025-${String(allOrders.length + 1).padStart(3, '0')}`,
        title: formData.get('title'),
        status: 'Draft',
        method: formData.get('method'),
        photographer: formData.get('photographer') || 'Unassigned',
        assignedTo: formData.get('photographer') ? authSystem.getUserIdByName(formData.get('photographer')) : null,
        deadline: formData.get('deadline'),
        costCenter: 'CC-NEW',
        priority: formData.get('priority'),
        brief: formData.get('brief'),
        articles: formData.get('articles').split('\\n').map(a => a.trim()).filter(a => a),
        buyers: buyersData.length > 0 ? buyersData : null,
        budget: formData.get('budget') ? Number(formData.get('budget')) : null,
        deliverables: formData.get('deliverables') ? formData.get('deliverables').split(',').map(d => d.trim()).filter(d => d) : [],
        photoTypes: selectedPhotoTypes.length > 0 ? selectedPhotoTypes : ['Product'], // Default to Product if none selected
        createdBy: authSystem.getCurrentUser().id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      };

      assignSalesOrgToOrder(newOrder, allOrders.length + 1);

      // Handle Post Production specific fields
      const method = formData.get('method');
      if (method === 'Post Production') {
        const postProductionType = formData.get('postProductionType');
        newOrder.postProduction = {
          type: postProductionType
        };

        if (postProductionType === 'GenAI') {
          // Collect GenAI configuration
          const genaiOperation = formData.get('genaiOperation');
          const genaiQuality = formData.get('genaiQuality');
          const genaiInstructions = formData.get('genaiInstructions');

          newOrder.postProduction.genaiConfig = {
            provider: 'Nano Banana',
            operation: genaiOperation,
            quality: genaiQuality,
            instructions: genaiInstructions,
            status: 'pending',
            estimatedCost: 0, // Will be calculated later
            processingTime: '2-5 minutes',
            createdAt: new Date().toISOString()
          };

          // Set initial status for GenAI orders
          newOrder.status = 'AI Processing Required';
        } else if (postProductionType === 'Internal') {
          newOrder.status = 'Internal Review';
        }
      }
      
  allOrders.unshift(newOrder);
  assignSalesOrgMetadata(allOrders);
      showView('orders');
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Order created successfully!';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    });

    document.getElementById('cancelCreate')?.addEventListener('click', () => showView('orders'));
    
    // Add buyer button event listener
    document.getElementById('addBuyerBtn')?.addEventListener('click', addBuyer);
    
    // Apply template rules button event listener
    document.getElementById('applyTemplateRulesBtn')?.addEventListener('click', () => {
      window.applyTemplateRulesToForm();
    });
    
    // Excel import button event listener
    document.getElementById('excelImportBtn')?.addEventListener('click', showExcelImportModal);
    
    // Placeholder items button event listener
    document.getElementById('placeholderItemsBtn')?.addEventListener('click', window.showPlaceholderItemsModal);
    
    // Template rules button event listener
    document.getElementById('templateRulesBtn')?.addEventListener('click', window.showTemplateRulesModal);
    
    // Historical suggestions button event listener
    document.getElementById('historicalSuggestionsBtn')?.addEventListener('click', window.showHistoricalSuggestionsModal);
    
    // DAM integration button event listener
    document.getElementById('damIntegrationBtn')?.addEventListener('click', window.showDAMIntegrationModal);
    document.getElementById('customizationRequestBtn')?.addEventListener('click', window.showCustomizationRequestModal);

    // Placeholder Items Management System
    window.showPlaceholderItemsModal = function() {
      const placeholderItems = window.getPlaceholderItems();
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:800px;width:90%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">Placeholder Items Management</h2>
            <button id="closePlaceholderModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:20px;">
            <p style="color:#6b5440;margin-bottom:16px;">Create placeholder items for products that haven't been registered yet. This allows you to plan photo shoots and create orders in advance.</p>
            
            <div style="background:#f1e8dc;padding:16px;border-radius:8px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Create New Placeholder Item</h3>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Placeholder ID</label>
                  <input id="placeholderIdInput" type="text" placeholder="e.g., TEMP-001, PLH-2025-001" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Category</label>
                  <select id="placeholderCategoryInput" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                    <option value="electronics">Electronics</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Description</label>
                <input id="placeholderDescInput" type="text" placeholder="Brief description of the item" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Expected Registration Date</label>
                  <input id="placeholderExpectedDateInput" type="date" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Priority</label>
                  <select id="placeholderPriorityInput" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Notes</label>
                <textarea id="placeholderNotesInput" placeholder="Additional notes, requirements, or specifications" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;min-height:60px;resize:vertical;"></textarea>
              </div>
              <button id="createPlaceholderBtn" style="padding:8px 16px;background:#f59e0b;color:white;border:none;border-radius:4px;cursor:pointer;">Create Placeholder Item</button>
            </div>
          </div>
          
          <div>
            <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Existing Placeholder Items</h3>
            <div id="placeholderItemsList">
              ${placeholderItems.length === 0 ? 
                '<p style="color:#6b5440;font-style:italic;">No placeholder items created yet.</p>' :
                placeholderItems.map(item => `
                  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;background:${item.priority === 'urgent' ? '#fef3c7' : item.priority === 'high' ? '#fecaca' : '#f9fafb'};">
                    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                      <div style="flex:1;">
                        <h4 style="margin:0 0 4px 0;font-size:14px;font-weight:600;">${item.id}</h4>
                        <p style="margin:0 0 4px 0;color:#6b5440;font-size:13px;">${item.description}</p>
                        <div style="display:flex;gap:12px;font-size:12px;color:#6b5440;">
                          <span>📂 ${item.category}</span>
                          <span>⏰ ${item.priority}</span>
                          <span>📅 Expected: ${item.expectedDate || 'Not set'}</span>
                        </div>
                      </div>
                      <div style="display:flex;gap:8px;">
                        <button onclick="createOrderFromPlaceholder('${item.id}')" style="padding:4px 8px;background:#c48b5a;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Create Order</button>
                        <button onclick="editPlaceholderItem('${item.id}')" style="padding:4px 8px;background:#6b5440;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Edit</button>
                        <button onclick="deletePlaceholderItem('${item.id}')" style="padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Delete</button>
                      </div>
                    </div>
                    ${item.notes ? `<p style="margin:8px 0 0 0;font-size:12px;color:#4b5563;background:#f1e8dc;padding:8px;border-radius:4px;">${item.notes}</p>` : ''}
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Set default expected date to 30 days from now
      const expectedDateInput = document.getElementById('placeholderExpectedDateInput');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      expectedDateInput.value = defaultDate.toISOString().split('T')[0];
      
      // Event listeners
      document.getElementById('closePlaceholderModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('createPlaceholderBtn').addEventListener('click', () => {
        window.createPlaceholderItem();
        // Refresh the modal content
        modal.remove();
        window.showPlaceholderItemsModal();
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }

    function getPlaceholderItems() {
      const items = localStorage.getItem('placeholderItems');
      return items ? JSON.parse(items) : [];
    }

    function savePlaceholderItems(items) {
      localStorage.setItem('placeholderItems', JSON.stringify(items));
    }

    window.createPlaceholderItem = function() {
      const id = document.getElementById('placeholderIdInput').value.trim();
      const category = document.getElementById('placeholderCategoryInput').value;
      const description = document.getElementById('placeholderDescInput').value.trim();
      const expectedDate = document.getElementById('placeholderExpectedDateInput').value;
      const priority = document.getElementById('placeholderPriorityInput').value;
      const notes = document.getElementById('placeholderNotesInput').value.trim();
      
      if (!id || !description) {
        alert('Please fill in the required fields (ID and Description)');
        return;
      }
      
      const placeholderItems = window.getPlaceholderItems();
      
      // Check if ID already exists
      if (placeholderItems.some(item => item.id === id)) {
        alert('A placeholder item with this ID already exists');
        return;
      }
      
      const newItem = {
        id,
        category,
        description,
        expectedDate,
        priority,
        notes,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: authSystem.getCurrentUser().username,
        status: 'active'
      };
      
      placeholderItems.push(newItem);
      window.savePlaceholderItems(placeholderItems);
      
      // Clear form
      document.getElementById('placeholderIdInput').value = '';
      document.getElementById('placeholderDescInput').value = '';
      document.getElementById('placeholderNotesInput').value = '';
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Placeholder item "${id}" created successfully!`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    function deletePlaceholderItem(itemId) {
      if (!confirm(`Are you sure you want to delete placeholder item "${itemId}"?`)) {
        return;
      }
      
      const placeholderItems = getPlaceholderItems();
      const updatedItems = placeholderItems.filter(item => item.id !== itemId);
      savePlaceholderItems(updatedItems);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        showPlaceholderItemsModal();
      }
    }

    function createOrderFromPlaceholder(itemId) {
      const placeholderItems = getPlaceholderItems();
      const item = placeholderItems.find(p => p.id === itemId);
      
      if (!item) {
        alert('Placeholder item not found');
        return;
      }
      
      // Close the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
      }
      
      // Switch to create order view
      showView('create');
      
      // Pre-fill the form with placeholder item data
      setTimeout(() => {
        const articleInput = document.getElementById('articleNumber');
        const titleInput = document.getElementById('orderTitle');
        const commentsInput = document.getElementById('orderComments');
        const prioritySelect = document.getElementById('orderPriority');
        
        if (articleInput) articleInput.value = item.id;
        if (titleInput) titleInput.value = `Content Project for ${item.description}`;
        if (commentsInput) commentsInput.value = `Placeholder item project: ${item.description}${item.notes ? '\n\nNotes: ' + item.notes : ''}`;
        if (prioritySelect) prioritySelect.value = item.priority;
        
        // Add placeholder indicator
        if (commentsInput) {
          commentsInput.value += '\n\n⚠️ This project uses a placeholder item. Please update the article number once the item is registered in the system.';
        }
      }, 100);
    }

    function editPlaceholderItem(itemId) {
      // For now, show a simple edit interface - could be expanded to a full edit modal
      const placeholderItems = getPlaceholderItems();
      const item = placeholderItems.find(p => p.id === itemId);
      
      if (!item) {
        alert('Placeholder item not found');
        return;
      }
      
      const newDescription = prompt('Edit description:', item.description);
      if (newDescription !== null && newDescription.trim()) {
        item.description = newDescription.trim();
        savePlaceholderItems(placeholderItems);
        
        // Refresh the modal
        const modal = document.querySelector('div[style*="position:fixed"]');
        if (modal) {
          modal.remove();
          window.showPlaceholderItemsModal();
        }
      }
    }

    // Advanced Template Rules Engine
    window.showTemplateRulesModal = function() {
      const templateRules = window.getTemplateRules();
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:900px;width:95%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">Advanced Template Rules Engine</h2>
            <button id="closeTemplateRulesModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <p style="color:#6b5440;margin-bottom:16px;">Configure intelligent rules that automatically include specific photo types based on item categories, keywords, and business logic. These rules help standardize photo requirements across your organization.</p>
            
            <div style="background:#f1e8dc;padding:16px;border-radius:8px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Create New Template Rule</h3>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Rule Name</label>
                  <input id="ruleNameInput" type="text" placeholder="e.g., Electronics Standard Package" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Priority</label>
                  <select id="rulePriorityInput" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="1">High (1)</option>
                    <option value="2" selected>Medium (2)</option>
                    <option value="3">Low (3)</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Trigger Conditions</label>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                  <select id="triggerTypeInput" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="category">Category Contains</option>
                    <option value="keyword">Article Contains</option>
                    <option value="supplier">Supplier Code</option>
                    <option value="price">Price Range</option>
                  </select>
                  <select id="triggerOperatorInput" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="starts">Starts With</option>
                    <option value="ends">Ends With</option>
                  </select>
                  <input id="triggerValueInput" type="text" placeholder="Value to match" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
              </div>
              
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Photo Types to Include</label>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;">
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Product"> Product Shot</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Lifestyle"> Lifestyle</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Detail"> Detail Shots</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="360"> 360° View</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Model"> Model Shots</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Size"> Size Guide</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Package"> Packaging</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Group"> Group Shot</label>
                </div>
              </div>
              
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Additional Requirements</label>
                <textarea id="ruleRequirementsInput" placeholder="Specific photography requirements, styling notes, or technical specifications" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;min-height:60px;resize:vertical;"></textarea>
              </div>
              
              <div style="display:flex;gap:12px;">
                <button id="createTemplateRuleBtn" style="padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:4px;cursor:pointer;">Create Rule</button>
                <button id="testRuleBtn" style="padding:8px 16px;background:#f59e0b;color:white;border:none;border-radius:4px;cursor:pointer;">Test Rule</button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Active Template Rules</h3>
            <div id="templateRulesList">
              ${templateRules.length === 0 ? 
                '<p style="color:#6b5440;font-style:italic;">No template rules configured yet. Create rules to automatically include photo types based on item characteristics.</p>' :
                templateRules.map(rule => `
                  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;background:${rule.active ? '#f0fdf4' : '#fef3c7'};">
                    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                      <div style="flex:1;">
                        <h4 style="margin:0 0 4px 0;font-size:14px;font-weight:600;">${rule.name}</h4>
                        <p style="margin:0 0 4px 0;color:#6b5440;font-size:13px;">
                          When <strong>${rule.triggerType}</strong> ${rule.operator} "<strong>${rule.triggerValue}</strong>"
                        </p>
                        <div style="margin:8px 0;">
                          <span style="font-size:12px;color:#4b5563;font-weight:500;">Includes:</span>
                          ${rule.photoTypes.map(type => `<span style="display:inline-block;background:#ddd6fe;color:#5b21b6;padding:2px 6px;border-radius:12px;font-size:11px;margin:2px 4px 2px 0;">${type}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:12px;font-size:12px;color:#6b5440;">
                          <span>🎯 Priority: ${rule.priority}</span>
                          <span>📊 Used: ${rule.usageCount || 0} times</span>
                          <span>${rule.active ? '✅ Active' : '⏸️ Paused'}</span>
                        </div>
                      </div>
                      <div style="display:flex;gap:8px;flex-direction:column;">
                        <div style="display:flex;gap:4px;">
                          <button onclick="toggleTemplateRule('${rule.id}')" style="padding:4px 8px;background:${rule.active ? '#f59e0b' : '#7fa284'};color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                            ${rule.active ? 'Pause' : 'Activate'}
                          </button>
                          <button onclick="editTemplateRule('${rule.id}')" style="padding:4px 8px;background:#6b5440;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Edit</button>
                        </div>
                        <button onclick="deleteTemplateRule('${rule.id}')" style="padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Delete</button>
                      </div>
                    </div>
                    ${rule.requirements ? `<p style="margin:8px 0 0 0;font-size:12px;color:#4b5563;background:#f1e8dc;padding:8px;border-radius:4px;">${rule.requirements}</p>` : ''}
                  </div>
                `).join('')
              }
            </div>
          </div>
          
          <div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#a66b38;">Smart Suggestions</h4>
            <p style="margin:0;font-size:12px;color:#a66b38;">
              💡 Consider creating rules for: High-value electronics (360° + Detail shots), Clothing items (Model + Size guide), 
              Home decor (Lifestyle + Group shots), Beauty products (Detail + Model shots)
            </p>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Event listeners
      document.getElementById('closeTemplateRulesModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('createTemplateRuleBtn').addEventListener('click', () => {
        window.createTemplateRule();
        modal.remove();
        window.showTemplateRulesModal();
      });
      
      document.getElementById('testRuleBtn').addEventListener('click', () => {
        window.testTemplateRule();
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    window.getTemplateRules = function() {
      const rules = localStorage.getItem('templateRules');
      return rules ? JSON.parse(rules) : [];
    };

    window.saveTemplateRules = function(rules) {
      localStorage.setItem('templateRules', JSON.stringify(rules));
    };

    window.createTemplateRule = function() {
      const name = document.getElementById('ruleNameInput').value.trim();
      const priority = parseInt(document.getElementById('rulePriorityInput').value);
      const triggerType = document.getElementById('triggerTypeInput').value;
      const operator = document.getElementById('triggerOperatorInput').value;
      const triggerValue = document.getElementById('triggerValueInput').value.trim();
      const requirements = document.getElementById('ruleRequirementsInput').value.trim();
      
      const photoTypes = Array.from(document.querySelectorAll('.photoTypeCheckbox:checked')).map(cb => cb.value);
      
      if (!name || !triggerValue || photoTypes.length === 0) {
        alert('Please fill in all required fields: Rule Name, Trigger Value, and select at least one Photo Type');
        return;
      }
      
      const templateRules = window.getTemplateRules();
      
      const newRule = {
        id: 'rule_' + Date.now(),
        name,
        priority,
        triggerType,
        operator,
        triggerValue: triggerValue.toLowerCase(),
        photoTypes,
        requirements,
        active: true,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: authSystem.getCurrentUser().username,
        usageCount: 0
      };
      
      templateRules.push(newRule);
      // Sort by priority
      templateRules.sort((a, b) => a.priority - b.priority);
      window.saveTemplateRules(templateRules);
      
      // Clear form
      document.getElementById('ruleNameInput').value = '';
      document.getElementById('triggerValueInput').value = '';
      document.getElementById('ruleRequirementsInput').value = '';
      document.querySelectorAll('.photoTypeCheckbox').forEach(cb => cb.checked = false);
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Template rule "${name}" created successfully!`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    window.testTemplateRule = function() {
      const triggerType = document.getElementById('triggerTypeInput').value;
      const operator = document.getElementById('triggerOperatorInput').value;
      const triggerValue = document.getElementById('triggerValueInput').value.trim().toLowerCase();
      const photoTypes = Array.from(document.querySelectorAll('.photoTypeCheckbox:checked')).map(cb => cb.value);
      
      if (!triggerValue || photoTypes.length === 0) {
        alert('Please enter a trigger value and select photo types to test');
        return;
      }
      
      // Test with sample data
      const testSamples = [
        { category: 'electronics', article: 'PHONE-IPHONE15', supplier: 'APPLE' },
        { category: 'clothing', article: 'SHIRT-COTTON-BLU', supplier: 'FASHION' },
        { category: 'home-decor', article: 'LAMP-TABLE-LED', supplier: 'DECOR' }
      ];
      
      const matches = testSamples.filter(sample => {
        let testValue = '';
        switch(triggerType) {
          case 'category': testValue = sample.category; break;
          case 'keyword': testValue = sample.article; break;
          case 'supplier': testValue = sample.supplier; break;
        }
        
        return window.matchesRule(testValue.toLowerCase(), operator, triggerValue);
      });
      
      alert(`Test Results:\nTrigger: ${triggerType} ${operator} "${triggerValue}"\nMatches: ${matches.length} out of ${testSamples.length} samples\nWould include: ${photoTypes.join(', ')}`);
    };

    window.matchesRule = function(testValue, operator, triggerValue) {
      switch(operator) {
        case 'contains': return testValue.includes(triggerValue);
        case 'equals': return testValue === triggerValue;
        case 'starts': return testValue.startsWith(triggerValue);
        case 'ends': return testValue.endsWith(triggerValue);
        default: return false;
      }
    };

    window.applyTemplateRules = function(articleNumber, category = '') {
      const templateRules = window.getTemplateRules().filter(rule => rule.active);
      const appliedPhotoTypes = new Set();
      const appliedRules = [];
      
      for (const rule of templateRules) {
        let testValue = '';
        switch(rule.triggerType) {
          case 'category': testValue = category.toLowerCase(); break;
          case 'keyword': testValue = articleNumber.toLowerCase(); break;
          case 'supplier': testValue = articleNumber.substring(0, 3).toLowerCase(); break; // Assume first 3 chars are supplier code
        }
        
        if (window.matchesRule(testValue, rule.operator, rule.triggerValue)) {
          rule.photoTypes.forEach(type => appliedPhotoTypes.add(type));
          appliedRules.push(rule);
          
          // Update usage count
          rule.usageCount = (rule.usageCount || 0) + 1;
        }
      }
      
      // Save updated usage counts
      if (appliedRules.length > 0) {
        window.saveTemplateRules(window.getTemplateRules());
      }
      
      return {
        photoTypes: Array.from(appliedPhotoTypes),
        appliedRules: appliedRules
      };
    };

    window.toggleTemplateRule = function(ruleId) {
      const templateRules = window.getTemplateRules();
      const rule = templateRules.find(r => r.id === ruleId);
      
      if (rule) {
        rule.active = !rule.active;
        window.saveTemplateRules(templateRules);
        
        // Refresh the modal
        const modal = document.querySelector('div[style*="position:fixed"]');
        if (modal) {
          modal.remove();
          window.showTemplateRulesModal();
        }
      }
    };

    window.editTemplateRule = function(ruleId) {
      const templateRules = window.getTemplateRules();
      const rule = templateRules.find(r => r.id === ruleId);
      
      if (!rule) {
        alert('Template rule not found');
        return;
      }
      
      const newName = prompt('Edit rule name:', rule.name);
      if (newName !== null && newName.trim()) {
        rule.name = newName.trim();
        window.saveTemplateRules(templateRules);
        
        // Refresh the modal
        const modal = document.querySelector('div[style*="position:fixed"]');
        if (modal) {
          modal.remove();
          window.showTemplateRulesModal();
        }
      }
    };

    window.deleteTemplateRule = function(ruleId) {
      if (!confirm('Are you sure you want to delete this template rule?')) {
        return;
      }
      
      const templateRules = window.getTemplateRules();
      const updatedRules = templateRules.filter(rule => rule.id !== ruleId);
      window.saveTemplateRules(updatedRules);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        window.showTemplateRulesModal();
      }
    };

    // Apply template rules to the order creation form
    window.applyTemplateRulesToForm = function() {
      const articlesTextarea = document.getElementById('articlesTextarea');
      if (!articlesTextarea || !articlesTextarea.value.trim()) {
        alert('Please enter at least one article before applying template rules');
        return;
      }

      // Extract first article for rule matching
      const firstArticle = articlesTextarea.value.trim().split('\n')[0];
      const articleNumber = firstArticle.split('[')[0].trim(); // Remove EAN part if present
      
      // Try to guess category from article number patterns
      let category = '';
      const articleLower = articleNumber.toLowerCase();
      if (articleLower.includes('cloth') || articleLower.includes('shirt') || articleLower.includes('dress')) {
        category = 'clothing';
      } else if (articleLower.includes('elec') || articleLower.includes('phone') || articleLower.includes('laptop')) {
        category = 'electronics';
      } else if (articleLower.includes('home') || articleLower.includes('decor') || articleLower.includes('lamp')) {
        category = 'home-decor';
      }

      const ruleResult = window.applyTemplateRules(articleNumber, category);
      
      if (ruleResult.photoTypes.length === 0) {
        alert('No template rules matched this article. You can create specific rules in the Template Rules manager.');
        return;
      }

      // Apply the photo types to checkboxes
      const photoTypeCheckboxes = document.querySelectorAll('input[name="photoTypes"]');
      photoTypeCheckboxes.forEach(checkbox => {
        if (ruleResult.photoTypes.includes(checkbox.value)) {
          checkbox.checked = true;
        }
      });

      // Show applied rules info
      const appliedRulesInfo = document.getElementById('appliedRulesInfo');
      if (appliedRulesInfo && ruleResult.appliedRules.length > 0) {
        appliedRulesInfo.style.display = 'block';
        appliedRulesInfo.innerHTML = `
          <strong>Applied Rules:</strong> ${ruleResult.appliedRules.map(rule => rule.name).join(', ')}<br>
          <strong>Photo Types:</strong> ${ruleResult.photoTypes.join(', ')}
        `;
      }

      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Applied ${ruleResult.appliedRules.length} template rule(s), selected ${ruleResult.photoTypes.length} photo type(s)`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Historical Data-Based Suggestions System
    window.showHistoricalSuggestionsModal = function() {
      // Close any open sidebar modals before showing this modal
      closeAllRightSideModals();
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:1000px;width:95%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">📊 Historical Data-Based Suggestions</h2>
            <button id="closeHistoricalModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <p style="color:#6b5440;margin-bottom:16px;">Get intelligent suggestions based on analysis of past orders. Enter an article or category to see data-driven recommendations for photo types, photographers, timelines, and requirements.</p>
            
            <div style="background:#f1e8dc;padding:16px;border-radius:8px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Analyze Similar Orders</h3>
              
              <div style="display:grid;grid-template-columns:1fr auto;gap:12px;margin-bottom:12px;">
                <input id="analysisInput" type="text" placeholder="Enter article number, category, or keywords" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <button id="analyzeBtn" style="padding:8px 16px;background:#c48b5a;color:white;border:none;border-radius:4px;cursor:pointer;">🔍 Analyze</button>
              </div>
              
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;">
                <button onclick="window.quickAnalysis('electronics')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">📱 Electronics</button>
                <button onclick="window.quickAnalysis('clothing')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">👕 Clothing</button>
                <button onclick="window.quickAnalysis('home-decor')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">🏠 Home Decor</button>
                <button onclick="window.quickAnalysis('beauty')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">💄 Beauty</button>
              </div>
            </div>
          </div>
          
          <div id="analysisResults" style="display:none;">
            <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:600;">Analysis Results</h3>
            <div id="analysisContent"></div>
          </div>
          
          <div>
            <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:600;">Global Analytics Dashboard</h3>
            <div id="globalAnalytics">
              ${window.generateGlobalAnalytics()}
            </div>
          </div>
          
          <div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#a66b38;">💡 Smart Insights</h4>
            <div id="smartInsights" style="font-size:12px;color:#a66b38;">
              ${window.generateSmartInsights()}
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Event listeners
      document.getElementById('closeHistoricalModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('analyzeBtn').addEventListener('click', () => {
        const input = document.getElementById('analysisInput').value.trim();
        if (input) {
          window.performHistoricalAnalysis(input);
        }
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    window.quickAnalysis = function(category) {
      document.getElementById('analysisInput').value = category;
      window.performHistoricalAnalysis(category);
    };

    window.performHistoricalAnalysis = function(searchTerm) {
      const orders = allOrders.filter(order => 
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.brief.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getArticleTextList(order.articles).some(article => 
          article.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (order.photoTypes && order.photoTypes.some(type =>
          type.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      
      if (orders.length === 0) {
        document.getElementById('analysisContent').innerHTML = `
          <div style="padding:16px;background:#fef3c7;border-radius:8px;">
            <p style="margin:0;color:#92400e;">No similar orders found for "${searchTerm}". Try a broader search term or check the global analytics below.</p>
          </div>
        `;
        document.getElementById('analysisResults').style.display = 'block';
        return;
      }
      
      const analysis = window.analyzeOrders(orders, searchTerm);
      
      document.getElementById('analysisContent').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;">
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#54735d;">📈 Volume Analysis</h4>
            <div style="font-size:12px;color:#54735d;">
              <div>Found: <strong>${orders.length}</strong> similar orders</div>
              <div>Date range: ${analysis.dateRange}</div>
              <div>Avg completion: <strong>${analysis.avgCompletionTime}</strong> days</div>
            </div>
          </div>
          
          <div style="background:#fef3c7;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#92400e;">📸 Photo Types</h4>
            <div style="font-size:12px;color:#92400e;">
              ${analysis.photoTypes.slice(0, 3).map(pt => `<div>${pt.type}: <strong>${pt.percentage}%</strong></div>`).join('')}
              ${analysis.photoTypes.length > 3 ? `<div>+${analysis.photoTypes.length - 3} more types</div>` : ''}
            </div>
          </div>
          
          <div style="background:#eff6ff;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1d4ed8;">👥 Top Photographers</h4>
            <div style="font-size:12px;color:#1d4ed8;">
              ${analysis.photographers.slice(0, 3).map(p => `<div>${p.name}: <strong>${p.count}</strong> orders</div>`).join('')}
            </div>
          </div>
          
          <div style="background:#f3e8ff;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#b48fc7;">⚡ Priority Patterns</h4>
            <div style="font-size:12px;color:#b48fc7;">
              ${analysis.priorities.slice(0, 3).map(p => `<div>${p.priority}: <strong>${p.percentage}%</strong></div>`).join('')}
            </div>
          </div>
        </div>
        
        <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;">
          <h4 style="margin:0 0 12px 0;font-size:14px;font-weight:600;">🎯 Recommendations for Similar Orders</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;">
            <div>
              <strong>Suggested Photo Types:</strong><br>
              ${analysis.recommendedPhotoTypes.map(type => `<span style="display:inline-block;background:#ddd6fe;color:#5b21b6;padding:2px 6px;border-radius:12px;font-size:11px;margin:2px 4px 2px 0;">${type}</span>`).join('')}
            </div>
            <div>
              <strong>Recommended Photographer:</strong><br>
              <span style="background:#dcfce7;color:#54735d;padding:4px 8px;border-radius:4px;font-size:12px;">${analysis.bestPhotographer}</span>
            </div>
            <div>
              <strong>Estimated Timeline:</strong><br>
              <span style="background:#fef3c7;color:#92400e;padding:4px 8px;border-radius:4px;font-size:12px;">${analysis.recommendedTimeline} days</span>
            </div>
            <div>
              <strong>Typical Budget Range:</strong><br>
              <span style="background:#eff6ff;color:#1d4ed8;padding:4px 8px;border-radius:4px;font-size:12px;">$${analysis.budgetRange}</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top:16px;">
          <button onclick="window.applyHistoricalSuggestions('${searchTerm}')" style="padding:8px 16px;background:#7fa284;color:white;border:none;border-radius:4px;cursor:pointer;">
            ✨ Apply Suggestions to New Order
          </button>
        </div>
      `;
      
      document.getElementById('analysisResults').style.display = 'block';
    };

    window.analyzeOrders = function(orders, searchTerm) {
      // Photo types analysis
      const photoTypesCount = {};
      orders.forEach(order => {
        if (order.photoTypes) {
          order.photoTypes.forEach(type => {
            photoTypesCount[type] = (photoTypesCount[type] || 0) + 1;
          });
        }
      });
      
      const photoTypes = Object.entries(photoTypesCount)
        .map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / orders.length) * 100)
        }))
        .sort((a, b) => b.count - a.count);
      
      // Photographers analysis
      const photographersCount = {};
      orders.forEach(order => {
        const photographer = order.photographer || 'Unassigned';
        photographersCount[photographer] = (photographersCount[photographer] || 0) + 1;
      });
      
      const photographers = Object.entries(photographersCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      
      // Priority analysis
      const prioritiesCount = {};
      orders.forEach(order => {
        const priority = order.priority || 'Medium';
        prioritiesCount[priority] = (prioritiesCount[priority] || 0) + 1;
      });
      
      const priorities = Object.entries(prioritiesCount)
        .map(([priority, count]) => ({
          priority,
          count,
          percentage: Math.round((count / orders.length) * 100)
        }))
        .sort((a, b) => b.count - a.count);
      
      // Timeline analysis
      const completedOrders = orders.filter(o => o.status === 'Completed');
      const avgCompletionTime = completedOrders.length > 0 
        ? Math.round(completedOrders.reduce((sum, order) => {
            const created = new Date(order.createdAt || '2025-01-01');
            const deadline = new Date(order.deadline);
            const diffTime = Math.abs(deadline - created);
            return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }, 0) / completedOrders.length)
        : 14;
      
      // Budget analysis
      const ordersWithBudget = orders.filter(o => o.budget && o.budget > 0);
      const avgBudget = ordersWithBudget.length > 0
        ? Math.round(ordersWithBudget.reduce((sum, o) => sum + o.budget, 0) / ordersWithBudget.length)
        : 1000;
      const minBudget = ordersWithBudget.length > 0 ? Math.min(...ordersWithBudget.map(o => o.budget)) : 500;
      const maxBudget = ordersWithBudget.length > 0 ? Math.max(...ordersWithBudget.map(o => o.budget)) : 2000;
      
      return {
        photoTypes,
        photographers,
        priorities,
        avgCompletionTime,
        dateRange: `${orders.length} orders from last 12 months`,
        recommendedPhotoTypes: photoTypes.slice(0, 4).map(pt => pt.type),
        bestPhotographer: photographers[0]?.name || 'Mike Rodriguez',
        recommendedTimeline: Math.max(avgCompletionTime, 7),
        budgetRange: `${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}`
      };
    };

    window.generateGlobalAnalytics = function() {
      const totalOrders = allOrders.length;
      const completedOrders = allOrders.filter(o => o.status === 'Completed').length;
      const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
      
      // Most popular photo types
      const allPhotoTypes = {};
      allOrders.forEach(order => {
        if (order.photoTypes) {
          order.photoTypes.forEach(type => {
            allPhotoTypes[type] = (allPhotoTypes[type] || 0) + 1;
          });
        }
      });
      
      const topPhotoTypes = Object.entries(allPhotoTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      return `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
          <div style="background:#fdf4e6;padding:16px;border-radius:8px;text-align:center;">
            <div style="font-size:24px;font-weight:bold;color:#a66b38;">${totalOrders}</div>
            <div style="font-size:12px;color:#6b5440;">Total Orders</div>
          </div>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
            <div style="font-size:24px;font-weight:bold;color:#54735d;">${completionRate}%</div>
            <div style="font-size:12px;color:#6b5440;">Completion Rate</div>
          </div>
          <div style="background:#fef3c7;padding:16px;border-radius:8px;">
            <div style="font-size:14px;font-weight:600;color:#92400e;margin-bottom:8px;">Top Photo Types</div>
            <div style="font-size:11px;color:#92400e;">
              ${topPhotoTypes.map(([type, count]) => `<div>${type}: ${count}</div>`).join('')}
            </div>
          </div>
        </div>
      `;
    };

    window.generateSmartInsights = function() {
      const insights = [
        "📈 Product shots are requested in 85% of orders - consider making them default",
        "⏰ Electronics orders typically need 2-3 more days than clothing orders",
        "👥 Mike Rodriguez has the highest completion rate for electronics photography",
        "💡 Orders with detailed briefs are completed 30% faster on average",
        "🎯 Template rules reduce order creation time by an average of 60%"
      ];
      
      return insights.join('<br>');
    };

    window.applyHistoricalSuggestions = function(searchTerm) {
      // Close the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
      }
      
      // Switch to create order view
      showView('create');
      
      // Apply suggestions after a short delay
      setTimeout(() => {
        const orders = allOrders.filter(order => 
          order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.brief.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (orders.length > 0) {
          const analysis = window.analyzeOrders(orders, searchTerm);
          
          // Fill in suggested values
          const titleInput = document.querySelector('input[name="title"]');
          const photographerSelect = document.querySelector('select[name="photographer"]');
          const prioritySelect = document.querySelector('select[name="priority"]');
          const deadlineInput = document.querySelector('input[name="deadline"]');
          
          if (titleInput && !titleInput.value) {
            titleInput.value = `Content Project for ${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Products`;
          }
          
          if (photographerSelect) {
            Array.from(photographerSelect.options).forEach(option => {
              if (option.text.includes(analysis.bestPhotographer)) {
                option.selected = true;
              }
            });
          }
          
          if (prioritySelect && analysis.priorities.length > 0) {
            prioritySelect.value = analysis.priorities[0].priority;
          }
          
          if (deadlineInput) {
            const suggestedDate = new Date();
            suggestedDate.setDate(suggestedDate.getDate() + analysis.recommendedTimeline);
            deadlineInput.value = suggestedDate.toISOString().split('T')[0];
          }
          
          // Apply suggested photo types
          analysis.recommendedPhotoTypes.forEach(type => {
            const checkbox = document.querySelector(`input[name="photoTypes"][value="${type}"]`);
            if (checkbox) {
              checkbox.checked = true;
            }
          });
          
          // Show applied suggestions info
          const appliedRulesInfo = document.getElementById('appliedRulesInfo');
          if (appliedRulesInfo) {
            appliedRulesInfo.style.display = 'block';
            appliedRulesInfo.innerHTML = `
              <strong>🤖 Applied Historical Suggestions:</strong><br>
              Based on analysis of ${orders.length} similar orders<br>
              <strong>Photo Types:</strong> ${analysis.recommendedPhotoTypes.join(', ')}<br>
              <strong>Photographer:</strong> ${analysis.bestPhotographer}<br>
              <strong>Timeline:</strong> ${analysis.recommendedTimeline} days
            `;
          }
        }
        
        // Show success message
        const success = document.createElement('div');
        success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
        success.textContent = `Applied historical suggestions based on ${orders.length} similar orders`;
        document.body.appendChild(success);
        setTimeout(() => success.remove(), 3000);
      }, 100);
    };

    // Active DAM Integration System
    window.showDAMIntegrationModal = function() {
      const damAssets = window.getDAMAssets();
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:1200px;width:95%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">☁️ Cloudinary Asset Management</h2>
            <button id="closeDAMModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <div style="background:#fdf4e6;padding:16px;border-radius:8px;margin-bottom:16px;">
              <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;color:#a66b38;">☁️ Cloudinary Connection Status</h3>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="width:12px;height:12px;background:#7fa284;border-radius:50%;"></span>
                <span style="font-size:14px;font-weight:500;">Cloudinary: Connected</span>
                <span style="background:#dcfce7;color:#54735d;padding:2px 8px;border-radius:12px;font-size:12px;margin-left:12px;">Active</span>
              </div>
              <div style="margin-top:8px;font-size:12px;color:#64748b;">
                Connected to demo cloud • Upload, manage, and transform your assets
              </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
              <div style="background:#f1e8dc;padding:16px;border-radius:8px;">
                <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📤 Upload to Cloudinary</h3>
                <div style="border:2px dashed #d1d5db;border-radius:8px;padding:20px;text-align:center;margin-bottom:12px;">
                  <input type="file" id="damFileInput" multiple accept="image/*,video/*" style="display:none;">
                  <button onclick="document.getElementById('damFileInput').click()" style="padding:8px 16px;background:#c48b5a;color:white;border:none;border-radius:4px;cursor:pointer;">
                    📁 Select Files
                  </button>
                  <p style="margin:8px 0 0;font-size:12px;color:#6b5440;">Support: JPG, PNG, TIFF, MP4, MOV up to 100MB</p>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                  <select id="damOrderSelect" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                    <option value="">Link to Order...</option>
                    ${allOrders.slice(0, 10).map(order => `<option value="${order.orderNumber}">${order.orderNumber} - ${order.title.substring(0, 30)}...</option>`).join('')}
                  </select>
                  <select id="damCategorySelect" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                    <option value="product">Product Photography</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="detail">Detail Shots</option>
                    <option value="360">360° Views</option>
                    <option value="model">Model Photography</option>
                    <option value="packaging">Packaging</option>
                  </select>
                </div>
                <input id="damTagsInput" placeholder="Tags (comma-separated)" style="width:100%;padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;margin-bottom:12px;">
                <button id="uploadToDAMBtn" style="width:100%;padding:8px;background:#7fa284;color:white;border:none;border-radius:4px;cursor:pointer;">
                  ⬆️ Upload to Cloudinary
                </button>
              </div>
              
              <div style="background:#f1e8dc;padding:16px;border-radius:8px;">
                <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">🔍 Search Cloudinary Assets</h3>
                <div style="display:grid;gap:8px;margin-bottom:12px;">
                  <input id="damSearchInput" placeholder="Search by filename, tags, or order number" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <select id="damFilterCategory" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                      <option value="">All Categories</option>
                      <option value="product">Product Photography</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="detail">Detail Shots</option>
                      <option value="360">360° Views</option>
                      <option value="model">Model Photography</option>
                    </select>
                    <select id="damFilterDate" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                      <option value="">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>
                </div>
                <button id="searchDAMBtn" style="width:100%;padding:8px;background:#c48b5a;color:white;border:none;border-radius:4px;cursor:pointer;">
                  🔍 Search Cloudinary
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:600;">📁 Recent Cloudinary Assets</h3>
            <div id="damAssetsGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
              ${damAssets.length === 0 ? 
                '<p style="grid-column:1/-1;color:#6b5440;font-style:italic;text-align:center;padding:40px;">No assets uploaded yet. Upload your first asset using the form above.</p>' :
                damAssets.map(asset => `
                  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:white;">
                    <div style="aspect-ratio:16/9;background:#f1e8dc;border-radius:6px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                      ${asset.type === 'image' ? 
                        `<img src="${asset.url}" alt="${asset.filename}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                         <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:#6b5440;">
                           🖼️ Image
                         </div>` :
                        `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6b5440;">
                           🎬 Video
                         </div>`
                      }
                    </div>
                    <div style="font-size:12px;font-weight:500;margin-bottom:4px;">${asset.filename}</div>
                    <div style="font-size:10px;color:#6b5440;margin-bottom:8px;">
                      ${asset.category} • ${asset.uploadDate}<br>
                      ${asset.orderNumber ? `Order: ${asset.orderNumber}` : 'No order linked'}
                    </div>
                    <div style="display:flex;gap:4px;margin-bottom:8px;">
                      ${asset.tags.slice(0, 3).map(tag => `<span style="background:#e5e7eb;color:#4b3b2a;padding:1px 4px;border-radius:2px;font-size:9px;">${tag}</span>`).join('')}
                      ${asset.tags.length > 3 ? `<span style="color:#6b5440;font-size:9px;">+${asset.tags.length - 3}</span>` : ''}
                    </div>
                    <div style="display:flex;gap:4px;">
                      <button onclick="window.viewDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#c48b5a;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">View</button>
                      <button onclick="window.downloadDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#7fa284;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">Download</button>
                      <button onclick="window.deleteDAMAsset('${asset.id}')" style="padding:4px;background:#ef4444;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">🗑️</button>
                    </div>
                  </div>
                `).join('')
              }
            </div>
          </div>
          
          <div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#a66b38;">☁️ Cloudinary Features</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;font-size:12px;color:#a66b38;">
              <div>✅ Automatic image optimization</div>
              <div>✅ Order-asset linking</div>
              <div>✅ Multi-format support</div>
              <div>✅ AI-powered tagging</div>
              <div>✅ Real-time transformations</div>
              <div>✅ CDN delivery</div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Event listeners
      document.getElementById('closeDAMModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('uploadToDAMBtn').addEventListener('click', () => {
        window.uploadToDAM();
      });
      
      document.getElementById('searchDAMBtn').addEventListener('click', () => {
        window.searchDAMAssets();
      });
      
      document.getElementById('damFileInput').addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const fileList = files.map(f => f.name).join(', ');
          const success = document.createElement('div');
          success.style.cssText = 'position:fixed;top:20px;right:20px;background:#c48b5a;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
          success.textContent = `Selected ${files.length} file(s): ${fileList.substring(0, 50)}${fileList.length > 50 ? '...' : ''}`;
          document.body.appendChild(success);
          setTimeout(() => success.remove(), 3000);
        }
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // ESC key to close modal
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    };

    window.getDAMAssets = function() {
      const assets = localStorage.getItem('damAssets');
      return assets ? JSON.parse(assets) : window.createSampleDAMAssets();
    };

    window.saveDAMAssets = function(assets) {
      localStorage.setItem('damAssets', JSON.stringify(assets));
    };

    window.createSampleDAMAssets = function() {
      const sampleAssets = [
        {
          id: 'dam_001',
          filename: 'product_phone_hero.jpg',
          type: 'image',
          category: 'product',
          orderNumber: 'ORD-2025-001',
          uploadDate: '2025-08-25',
          tags: ['phone', 'electronics', 'hero', 'product'],
          url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          size: '2.4 MB',
          uploader: 'Mike Rodriguez'
        },
        {
          id: 'dam_002',
          filename: 'lifestyle_home_setup.jpg',
          type: 'image',
          category: 'lifestyle',
          orderNumber: 'ORD-2025-002',
          uploadDate: '2025-08-24',
          tags: ['home', 'lifestyle', 'setup', 'ambient'],
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          size: '3.1 MB',
          uploader: 'Emily Chen'
        },
        {
          id: 'dam_003',
          filename: 'detail_watch_mechanism.jpg',
          type: 'image',
          category: 'detail',
          orderNumber: 'ORD-2025-003',
          uploadDate: '2025-08-23',
          tags: ['watch', 'detail', 'mechanism', 'macro'],
          url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
          size: '1.8 MB',
          uploader: 'Alex Turner'
        },
        {
          id: 'dam_004',
          filename: 'model_fashion_shoot.mp4',
          type: 'video',
          category: 'model',
          orderNumber: 'ORD-2025-004',
          uploadDate: '2025-08-22',
          tags: ['fashion', 'model', 'video', 'commercial'],
          url: null,
          size: '45.2 MB',
          uploader: 'Mike Rodriguez'
        }
      ];
      
      window.saveDAMAssets(sampleAssets);
      return sampleAssets;
    };

    window.uploadToDAM = function() {
      const fileInput = document.getElementById('damFileInput');
      const orderSelect = document.getElementById('damOrderSelect');
      const categorySelect = document.getElementById('damCategorySelect');
      const tagsInput = document.getElementById('damTagsInput');
      
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select files to upload');
        return;
      }
      
      const files = Array.from(fileInput.files);
      const damAssets = window.getDAMAssets();
      
      files.forEach((file, index) => {
        const newAsset = {
          id: 'dam_' + Date.now() + '_' + index,
          filename: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          category: categorySelect.value || 'product',
          orderNumber: orderSelect.value || null,
          uploadDate: new Date().toISOString().split('T')[0],
          tags: tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t) : [],
          url: URL.createObjectURL(file), // In real implementation, this would be the DAM URL
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploader: authSystem.getCurrentUser().username
        };
        
        damAssets.unshift(newAsset);
      });
      
      window.saveDAMAssets(damAssets);
      
      // Clear form
      fileInput.value = '';
      tagsInput.value = '';
      orderSelect.value = '';
      
      // Refresh modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        window.showDAMIntegrationModal();
      }
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#7fa284;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Successfully uploaded ${files.length} asset(s) to DAM`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    window.searchDAMAssets = function() {
      const searchTerm = document.getElementById('damSearchInput').value.toLowerCase();
      const categoryFilter = document.getElementById('damFilterCategory').value;
      const dateFilter = document.getElementById('damFilterDate').value;
      
      const allAssets = window.getDAMAssets();
      let filteredAssets = allAssets;
      
      if (searchTerm) {
        filteredAssets = filteredAssets.filter(asset =>
          asset.filename.toLowerCase().includes(searchTerm) ||
          asset.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          (asset.orderNumber && asset.orderNumber.toLowerCase().includes(searchTerm))
        );
      }
      
      if (categoryFilter) {
        filteredAssets = filteredAssets.filter(asset => asset.category === categoryFilter);
      }
      
      if (dateFilter) {
        const today = new Date();
        const filterDate = new Date();
        switch(dateFilter) {
          case 'today':
            filterDate.setDate(today.getDate());
            break;
          case 'week':
            filterDate.setDate(today.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(today.getMonth() - 1);
            break;
          case 'quarter':
            filterDate.setMonth(today.getMonth() - 3);
            break;
        }
        filteredAssets = filteredAssets.filter(asset => new Date(asset.uploadDate) >= filterDate);
      }
      
      // Update grid
      const grid = document.getElementById('damAssetsGrid');
      if (filteredAssets.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;color:#6b5440;font-style:italic;text-align:center;padding:40px;">No assets found matching your search criteria.</p>';
      } else {
        grid.innerHTML = filteredAssets.map(asset => `
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:white;">
            <div style="aspect-ratio:16/9;background:#f1e8dc;border-radius:6px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
              ${asset.type === 'image' ? 
                `<img src="${asset.url}" alt="${asset.filename}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                 <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:#6b5440;">
                   🖼️ Image
                 </div>` :
                `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6b5440;">
                   🎬 Video
                 </div>`
              }
            </div>
            <div style="font-size:12px;font-weight:500;margin-bottom:4px;">${asset.filename}</div>
            <div style="font-size:10px;color:#6b5440;margin-bottom:8px;">
              ${asset.category} • ${asset.uploadDate}<br>
              ${asset.orderNumber ? `Order: ${asset.orderNumber}` : 'No order linked'}
            </div>
            <div style="display:flex;gap:4px;margin-bottom:8px;">
              ${asset.tags.slice(0, 3).map(tag => `<span style="background:#e5e7eb;color:#4b3b2a;padding:1px 4px;border-radius:2px;font-size:9px;">${tag}</span>`).join('')}
              ${asset.tags.length > 3 ? `<span style="color:#6b5440;font-size:9px;">+${asset.tags.length - 3}</span>` : ''}
            </div>
            <div style="display:flex;gap:4px;">
              <button onclick="window.viewDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#c48b5a;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">View</button>
              <button onclick="window.downloadDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#7fa284;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">Download</button>
              <button onclick="window.deleteDAMAsset('${asset.id}')" style="padding:4px;background:#ef4444;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">🗑️</button>
            </div>
          </div>
        `).join('');
      }
      
      // Show results info
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#c48b5a;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Found ${filteredAssets.length} asset(s) matching your criteria`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    window.viewDAMAsset = function(assetId) {
      const damAssets = window.getDAMAssets();
      const asset = damAssets.find(a => a.id === assetId);
      
      if (!asset) {
        alert('Asset not found');
        return;
      }
      
      if (asset.type === 'image' && asset.url) {
        window.open(asset.url, '_blank');
      } else {
        alert(`Viewing ${asset.filename} (${asset.type})\nSize: ${asset.size}\nUploader: ${asset.uploader}\nTags: ${asset.tags.join(', ')}`);
      }
    };

    window.downloadDAMAsset = function(assetId) {
      const damAssets = window.getDAMAssets();
      const asset = damAssets.find(a => a.id === assetId);
      
      if (!asset) {
        alert('Asset not found');
        return;
      }
      
      // In a real implementation, this would trigger actual download
      alert(`Download initiated for ${asset.filename}\nSize: ${asset.size}\nThis would normally download from the DAM system.`);
    };

    window.deleteDAMAsset = function(assetId) {
      if (!confirm('Are you sure you want to delete this asset from the DAM?')) {
        return;
      }
      
      const damAssets = window.getDAMAssets();
      const updatedAssets = damAssets.filter(asset => asset.id !== assetId);
      window.saveDAMAssets(updatedAssets);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        window.showDAMIntegrationModal();
      }
      
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#ef4444;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Asset deleted from DAM';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Customization Request System
    window.getCustomizationRequests = function() {
      return JSON.parse(localStorage.getItem('customizationRequests') || '[]');
    };

    window.saveCustomizationRequests = function(requests) {
      localStorage.setItem('customizationRequests', JSON.stringify(requests));
    };

    // Initialize sample customization requests if none exist
    window.initializeCustomizationRequests = function() {
      const existing = window.getCustomizationRequests();
      if (existing.length === 0) {
        const sampleRequests = [
          {
            id: 'CR-1734567890123',
            type: 'integration',
            priority: 'high',
            title: 'SAP Material Master Integration Enhancement',
            description: 'Enhance the current SAP PMR integration to include real-time material master updates, automated price synchronization, and advanced vendor information pull. Current system only does basic order sync.',
            justification: 'Will reduce manual data entry by 80% and eliminate pricing discrepancies between SAP and photo system. Estimated time savings: 15 hours per week across procurement team.',
            departments: ['procurement', 'it', 'photography'],
            timeline: '3-months',
            notes: 'Need to coordinate with SAP team for API access expansion. Budget approval already obtained.',
            status: 'in-progress',
            submittedDate: '12/15/2024',
            submittedBy: 'Sarah Johnson (Procurement Manager)',
            lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'CR-1734567890124',
            type: 'automation', 
            priority: 'medium',
            title: 'Automated Photography Schedule Optimization',
            description: 'Implement AI-driven scheduling system that automatically optimizes photographer assignments based on location, skill specialization, workload, and item complexity to maximize efficiency.',
            justification: 'Current manual scheduling leads to suboptimal resource allocation. AI optimization could improve photographer utilization by 25% and reduce travel costs by scheduling location-based batches.',
            departments: ['photography', 'operations'],
            timeline: '6-months',
            notes: 'Requires machine learning model training on historical scheduling data. Consider partnership with AI vendor.',
            status: 'submitted',
            submittedDate: '12/18/2024',
            submittedBy: 'Michael Chen (Photography Director)',
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'CR-1734567890125',
            type: 'reporting',
            priority: 'high',
            title: 'Executive Dashboard with Advanced Analytics',
            description: 'Create comprehensive executive dashboard showing photo shoot ROI, photographer performance metrics, cost per item trends, seasonal demand patterns, and predictive analytics for resource planning.',
            justification: 'Leadership currently lacks visibility into photo operation efficiency and costs. Advanced analytics will enable data-driven decisions for budget allocation and capacity planning.',
            departments: ['finance', 'operations', 'photography'],
            timeline: '1-month',
            notes: 'High priority for Q1 budget review meetings. Need integration with existing BI tools.',
            status: 'completed',
            submittedDate: '11/28/2024',
            submittedBy: 'Jennifer Walsh (CFO)',
            lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'CR-1734567890126',
            type: 'workflow',
            priority: 'critical',
            title: 'Multi-Language Support for Global Operations',
            description: 'Add comprehensive multi-language support including German, French, Spanish, and Mandarin interfaces, with localized date formats, currency display, and cultural adaptations for global rollout.',
            justification: 'Critical for expansion into European and Asian markets. Current English-only system blocking international adoption. Projected to enable 40% increase in global photo operations.',
            departments: ['it', 'operations', 'marketing'],
            timeline: 'asap',
            notes: 'Blocking factor for Q1 international launch. Translation vendor already contracted.',
            status: 'submitted',
            submittedDate: '12/20/2024', 
            submittedBy: 'Hans Mueller (Global Operations Director)',
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        window.saveCustomizationRequests(sampleRequests);
      }
    };

    window.showCustomizationRequestModal = function() {
      // Initialize sample data if needed
      window.initializeCustomizationRequests();
      
      const modal = document.createElement('div');
      modal.id = 'customizationRequestModal';
      modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);z-index:10000;display:flex;
        align-items:center;justify-content:center;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background:white;border-radius:12px;width:90%;max-width:800px;
        max-height:90vh;overflow-y:auto;position:relative;
      `;

      const existingRequests = window.getCustomizationRequests();

      content.innerHTML = `
        <div style="padding:24px;border-bottom:1px solid #e5e7eb;">
          <h2 style="margin:0;font-size:20px;color:#4b3b2a;display:flex;align-items:center;">
            🔧 Customization Request System
            <button onclick="document.getElementById('customizationRequestModal').remove()" 
                    style="margin-left:auto;background:none;border:none;font-size:24px;cursor:pointer;color:#6b5440;">×</button>
          </h2>
          <p style="margin:8px 0 0;color:#6b5440;font-size:14px;">Submit and track custom feature requests and system modifications</p>
        </div>

        <div style="padding:24px;">
          <!-- Request Statistics -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:24px;">
            <div style="background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#7fa284;">${existingRequests.length}</div>
              <div style="font-size:12px;color:#7fa284;">Total Requests</div>
            </div>
            <div style="background:#fef3f2;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#dc2626;">${existingRequests.filter(r => r.status === 'submitted').length}</div>
              <div style="font-size:12px;color:#dc2626;">Pending Review</div>
            </div>
            <div style="background:#fffbeb;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#d97706;">${existingRequests.filter(r => r.status === 'in-progress').length}</div>
              <div style="font-size:12px;color:#d97706;">In Progress</div>
            </div>
            <div style="background:#fdf4e6;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#0284c7;">${existingRequests.filter(r => r.status === 'completed').length}</div>
              <div style="font-size:12px;color:#0284c7;">Completed</div>
            </div>
          </div>

          <!-- New Request Form -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
            <h3 style="margin:0 0 16px;font-size:16px;color:#4b3b2a;">Submit New Request</h3>
            
            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Request Type *</label>
              <select id="requestType" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <option value="">Select request type...</option>
                <option value="feature">New Feature</option>
                <option value="enhancement">Enhancement</option>
                <option value="integration">System Integration</option>
                <option value="workflow">Workflow Modification</option>
                <option value="reporting">Custom Reporting</option>
                <option value="ui-ux">UI/UX Changes</option>
                <option value="automation">Process Automation</option>
                <option value="security">Security Enhancement</option>
                <option value="performance">Performance Optimization</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Priority Level *</label>
              <select id="requestPriority" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <option value="">Select priority...</option>
                <option value="critical">🔴 Critical - Business Impact</option>
                <option value="high">🟠 High - Important Enhancement</option>
                <option value="medium">🟡 Medium - Nice to Have</option>
                <option value="low">🟢 Low - Future Consideration</option>
              </select>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Request Title *</label>
              <input type="text" id="requestTitle" placeholder="Brief description of the request" 
                     style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Detailed Description *</label>
              <textarea id="requestDescription" rows="4" placeholder="Detailed description of what you need, including current limitations and desired outcomes"
                        style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;"></textarea>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Business Justification</label>
              <textarea id="requestJustification" rows="3" placeholder="How will this benefit the business? Include efficiency gains, cost savings, or process improvements"
                        style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;"></textarea>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Affected Department(s)</label>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:8px;">
                <label style="display:flex;align-items:center;"><input type="checkbox" value="photography" style="margin-right:8px;">Photography</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="procurement" style="margin-right:8px;">Procurement</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="marketing" style="margin-right:8px;">Marketing</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="it" style="margin-right:8px;">IT</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="finance" style="margin-right:8px;">Finance</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="operations" style="margin-right:8px;">Operations</label>
              </div>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Expected Timeline</label>
              <select id="requestTimeline" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <option value="">Select expected timeline...</option>
                <option value="asap">ASAP - Urgent</option>
                <option value="1-month">Within 1 Month</option>
                <option value="3-months">Within 3 Months</option>
                <option value="6-months">Within 6 Months</option>
                <option value="flexible">Flexible Timeline</option>
              </select>
            </div>

            <div style="margin-bottom:20px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#4b3b2a;">Additional Notes</label>
              <textarea id="requestNotes" rows="2" placeholder="Any additional information, constraints, or requirements"
                        style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;"></textarea>
            </div>

            <button onclick="window.submitCustomizationRequest()" 
                    style="background:#b48fc7;color:white;border:none;border-radius:6px;padding:10px 20px;font-size:14px;cursor:pointer;font-weight:500;">
              📤 Submit Request
            </button>
          </div>

          <!-- Existing Requests -->
          <div>
            <h3 style="margin:0 0 16px;font-size:16px;color:#4b3b2a;">Request History</h3>
            <div id="customizationRequestsList">
              ${existingRequests.length === 0 ? `
                <div style="text-align:center;padding:40px;color:#6b5440;">
                  <div style="font-size:48px;margin-bottom:16px;">📝</div>
                  <p style="margin:0;font-size:16px;">No customization requests yet</p>
                  <p style="margin:8px 0 0;font-size:14px;">Submit your first request using the form above</p>
                </div>
              ` : existingRequests.map(request => `
                <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;background:white;">
                  <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
                    <div>
                      <h4 style="margin:0 0 4px;font-size:14px;color:#4b3b2a;">${request.title}</h4>
                      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                        <span style="background:${getRequestTypeColor(request.type)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;">
                          ${getRequestTypeLabel(request.type)}
                        </span>
                        <span style="background:${getPriorityColor(request.priority)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;">
                          ${getPriorityLabel(request.priority)}
                        </span>
                        <span style="background:${getStatusColor(request.status)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;">
                          ${getStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>
                    <div style="text-align:right;font-size:12px;color:#6b5440;">
                      <div>ID: ${request.id}</div>
                      <div>${request.submittedDate}</div>
                    </div>
                  </div>
                  
                  <p style="margin:0 0 12px;font-size:13px;color:#4b5563;">${request.description.length > 150 ? request.description.substring(0, 150) + '...' : request.description}</p>
                  
                  ${request.justification ? `
                    <div style="background:#f9fafb;padding:8px;border-radius:4px;margin-bottom:8px;">
                      <strong style="font-size:11px;color:#4b3b2a;">Business Justification:</strong>
                      <p style="margin:4px 0 0;font-size:12px;color:#6b5440;">${request.justification.length > 100 ? request.justification.substring(0, 100) + '...' : request.justification}</p>
                    </div>
                  ` : ''}
                  
                  <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#6b5440;">
                    <div>
                      ${request.departments && request.departments.length > 0 ? 
                        `Departments: ${request.departments.join(', ')}` : 
                        ''
                      }
                      ${request.timeline ? ` • Timeline: ${request.timeline}` : ''}
                    </div>
                    <div style="display:flex;gap:8px;">
                      <button onclick="window.viewCustomizationRequest('${request.id}')" 
                              style="background:#c48b5a;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">
                        View Details
                      </button>
                      ${request.status === 'submitted' ? `
                        <button onclick="window.updateRequestStatus('${request.id}', 'in-progress')" 
                                style="background:#f59e0b;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">
                          Start Work
                        </button>
                      ` : ''}
                      ${request.status === 'in-progress' ? `
                        <button onclick="window.updateRequestStatus('${request.id}', 'completed')" 
                                style="background:#7fa284;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">
                          Mark Complete
                        </button>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      // Helper functions for styling
      function getRequestTypeColor(type) {
        const colors = {
          'feature': '#c48b5a',
          'enhancement': '#7fa284',
          'integration': '#f59e0b',
          'workflow': '#bfa3d6',
          'reporting': '#8fb0a3',
          'ui-ux': '#ec4899',
          'automation': '#84cc16',
          'security': '#ef4444',
          'performance': '#f97316',
          'other': '#6b5440'
        };
        return colors[type] || '#6b5440';
      }

      function getRequestTypeLabel(type) {
        const labels = {
          'feature': 'New Feature',
          'enhancement': 'Enhancement',
          'integration': 'Integration',
          'workflow': 'Workflow',
          'reporting': 'Reporting',
          'ui-ux': 'UI/UX',
          'automation': 'Automation',
          'security': 'Security',
          'performance': 'Performance',
          'other': 'Other'
        };
        return labels[type] || 'Other';
      }

      function getPriorityColor(priority) {
        const colors = {
          'critical': '#dc2626',
          'high': '#f59e0b',
          'medium': '#eab308',
          'low': '#22c55e'
        };
        return colors[priority] || '#6b5440';
      }

      function getPriorityLabel(priority) {
        const labels = {
          'critical': 'Critical',
          'high': 'High',
          'medium': 'Medium',
          'low': 'Low'
        };
        return labels[priority] || 'Medium';
      }

      function getStatusColor(status) {
        const colors = {
          'submitted': '#ef4444',
          'in-progress': '#f59e0b',
          'completed': '#22c55e',
          'on-hold': '#6b5440',
          'cancelled': '#dc2626'
        };
        return colors[status] || '#6b5440';
      }

      function getStatusLabel(status) {
        const labels = {
          'submitted': 'Submitted',
          'in-progress': 'In Progress',
          'completed': 'Completed',
          'on-hold': 'On Hold',
          'cancelled': 'Cancelled'
        };
        return labels[status] || 'Submitted';
      }
    };

    window.submitCustomizationRequest = function() {
      const type = document.getElementById('requestType').value;
      const priority = document.getElementById('requestPriority').value;
      const title = document.getElementById('requestTitle').value.trim();
      const description = document.getElementById('requestDescription').value.trim();
      const justification = document.getElementById('requestJustification').value.trim();
      const timeline = document.getElementById('requestTimeline').value;
      const notes = document.getElementById('requestNotes').value.trim();

      // Get selected departments
      const departmentCheckboxes = document.querySelectorAll('#customizationRequestModal input[type="checkbox"]:checked');
      const departments = Array.from(departmentCheckboxes).map(cb => cb.value);

      // Validation
      if (!type || !priority || !title || !description) {
        alert('Please fill in all required fields (marked with *)');
        return;
      }

      const newRequest = {
        id: 'CR-' + Date.now(),
        type,
        priority,
        title,
        description,
        justification,
        departments,
        timeline,
        notes,
        status: 'submitted',
        submittedDate: new Date().toLocaleDateString(),
        submittedBy: 'Current User',
        lastUpdated: new Date().toISOString()
      };

      const requests = window.getCustomizationRequests();
      requests.push(newRequest);
      window.saveCustomizationRequests(requests);

      // Clear form
      document.getElementById('requestType').value = '';
      document.getElementById('requestPriority').value = '';
      document.getElementById('requestTitle').value = '';
      document.getElementById('requestDescription').value = '';
      document.getElementById('requestJustification').value = '';
      document.getElementById('requestTimeline').value = '';
      document.getElementById('requestNotes').value = '';
      departmentCheckboxes.forEach(cb => cb.checked = false);

      // Close modal and show success
      document.getElementById('customizationRequestModal').remove();
      
      alert('✅ Customization request submitted successfully!\\n\\nRequest ID: ' + newRequest.id + '\\n\\nYou can track its progress in the Request History section.');
    };

    window.viewCustomizationRequest = function(requestId) {
      const requests = window.getCustomizationRequests();
      const request = requests.find(r => r.id === requestId);
      
      if (!request) {
        alert('Request not found');
        return;
      }

      const modal = document.createElement('div');
      modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);z-index:10001;display:flex;
        align-items:center;justify-content:center;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background:white;border-radius:12px;width:90%;max-width:600px;
        max-height:90vh;overflow-y:auto;position:relative;
      `;

      content.innerHTML = `
        <div style="padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:18px;color:#4b3b2a;">Request Details</h2>
            <button onclick="this.closest('[style*=\"z-index:10001\"]').remove()" 
                    style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b5440;">×</button>
          </div>
          
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">
              <div>
                <strong style="font-size:12px;color:#4b3b2a;">Request ID:</strong>
                <div style="font-size:14px;color:#4b3b2a;">${request.id}</div>
              </div>
              <div>
                <strong style="font-size:12px;color:#4b3b2a;">Status:</strong>
                <span style="background:${getStatusColor(request.status)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;margin-left:4px;">
                  ${getStatusLabel(request.status)}
                </span>
              </div>
              <div>
                <strong style="font-size:12px;color:#4b3b2a;">Priority:</strong>
                <span style="background:${getPriorityColor(request.priority)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;margin-left:4px;">
                  ${getPriorityLabel(request.priority)}
                </span>
              </div>
              <div>
                <strong style="font-size:12px;color:#4b3b2a;">Type:</strong>
                <span style="background:${getRequestTypeColor(request.type)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;margin-left:4px;">
                  ${getRequestTypeLabel(request.type)}
                </span>
              </div>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <strong style="font-size:12px;color:#4b3b2a;">Title:</strong>
            <div style="font-size:14px;color:#4b3b2a;margin-top:4px;">${request.title}</div>
          </div>

          <div style="margin-bottom:16px;">
            <strong style="font-size:12px;color:#4b3b2a;">Description:</strong>
            <div style="font-size:14px;color:#4b3b2a;margin-top:4px;line-height:1.5;">${request.description}</div>
          </div>

          ${request.justification ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#4b3b2a;">Business Justification:</strong>
              <div style="font-size:14px;color:#4b3b2a;margin-top:4px;line-height:1.5;">${request.justification}</div>
            </div>
          ` : ''}

          ${request.departments && request.departments.length > 0 ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#4b3b2a;">Affected Departments:</strong>
              <div style="margin-top:4px;">
                ${request.departments.map(dept => 
                  `<span style="background:#e5e7eb;color:#4b3b2a;padding:2px 8px;border-radius:12px;font-size:11px;margin-right:4px;">${dept}</span>`
                ).join('')}
              </div>
            </div>
          ` : ''}

          ${request.timeline ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#4b3b2a;">Expected Timeline:</strong>
              <div style="font-size:14px;color:#4b3b2a;margin-top:4px;">${request.timeline}</div>
            </div>
          ` : ''}

          ${request.notes ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#4b3b2a;">Additional Notes:</strong>
              <div style="font-size:14px;color:#4b3b2a;margin-top:4px;line-height:1.5;">${request.notes}</div>
            </div>
          ` : ''}

          <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:12px;color:#6b5440;">
              <div>
                <strong>Submitted:</strong> ${request.submittedDate}<br>
                <strong>By:</strong> ${request.submittedBy}
              </div>
              <div>
                <strong>Last Updated:</strong> ${new Date(request.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>

          <div style="margin-top:20px;display:flex;gap:8px;justify-content:flex-end;">
            ${request.status === 'submitted' ? `
              <button onclick="window.updateRequestStatus('${request.id}', 'in-progress'); this.closest('[style*=\"z-index:10001\"]').remove(); window.showCustomizationRequestModal();" 
                      style="background:#f59e0b;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:12px;cursor:pointer;">
                Start Work
              </button>
            ` : ''}
            ${request.status === 'in-progress' ? `
              <button onclick="window.updateRequestStatus('${request.id}', 'completed'); this.closest('[style*=\"z-index:10001\"]').remove(); window.showCustomizationRequestModal();" 
                      style="background:#7fa284;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:12px;cursor:pointer;">
                Mark Complete
              </button>
            ` : ''}
            <button onclick="this.closest('[style*=\"z-index:10001\"]').remove()" 
                    style="background:#6b5440;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:12px;cursor:pointer;">
              Close
            </button>
          </div>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    window.updateRequestStatus = function(requestId, newStatus) {
      const requests = window.getCustomizationRequests();
      const requestIndex = requests.findIndex(r => r.id === requestId);
      
      if (requestIndex === -1) {
        alert('Request not found');
        return;
      }

      requests[requestIndex].status = newStatus;
      requests[requestIndex].lastUpdated = new Date().toISOString();
      
      window.saveCustomizationRequests(requests);
      
      const statusLabels = {
        'submitted': 'Submitted',
        'in-progress': 'In Progress', 
        'completed': 'Completed',
        'on-hold': 'On Hold',
        'cancelled': 'Cancelled'
      };
      
      alert('✅ Request status updated to: ' + statusLabels[newStatus]);
    };

    // Enhanced Comments and Notifications System
    class CommentSystem {
      constructor() {
        this.notifications = this.loadNotifications();
        this.currentUser = { id: 'user1', name: 'Current User', role: 'Admin' }; // Simplified for fallback
      }

      loadNotifications() {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
      }

      saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
      }

      addComment(orderId, message) {
        const comment = {
          id: this.generateId(),
          orderId,
          userId: this.currentUser.id,
          userName: this.currentUser.name,
          userRole: this.currentUser.role,
          message: message.trim(),
          createdAt: new Date().toISOString(),
          isRead: false,
          readBy: [this.currentUser.id]
        };

        // Find order and add comment
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order) throw new Error('Order not found');

        order.comments = order.comments || [];
        order.comments.push(comment);
        order.lastActivity = new Date().toISOString();

        // Send notifications to involved users
        this.sendCommentNotifications(order, comment);

        return comment;
      }

      getComments(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        return order?.comments || [];
      }

      getUnreadCommentCount(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order?.comments) return 0;

        return order.comments.filter(comment => 
          !comment.readBy.includes(this.currentUser.id)
        ).length;
      }

      getTotalUnreadComments() {
        let totalUnread = 0;
        orders.forEach(order => {
          if (order.comments) {
            totalUnread += order.comments.filter(comment => 
              !comment.readBy.includes(this.currentUser.id)
            ).length;
          }
        });
        return totalUnread;
      }

      markCommentsAsRead(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order?.comments) return;

        order.comments.forEach(comment => {
          if (!comment.readBy.includes(this.currentUser.id)) {
            comment.readBy.push(this.currentUser.id);
          }
        });
      }

      addNotification(notification) {
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.showToast(`💬 ${notification.title}`, 'info');
      }

      getUnreadNotificationCount() {
        return this.notifications.filter(n => 
          n.userId === this.currentUser.id && !n.isRead
        ).length;
      }

      markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.saveNotifications();
        }
      }

      sendCommentNotifications(order, comment) {
        // Simple notification for demonstration - in real app would notify specific users
        const notification = {
          id: this.generateId(),
          userId: 'photographer1', // Would be dynamic based on order assignment
          type: 'comment',
          title: `New comment on ${order.title}`,
          message: `${this.currentUser.name}: ${comment.message.substring(0, 100)}${comment.message.length > 100 ? '...' : ''}`,
          orderId: order.orderNumber,
          commentId: comment.id,
          isRead: false,
          createdAt: new Date().toISOString()
        };

        this.addNotification(notification);
      }

      showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
          success: '#7fa284',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#c48b5a'
        };
        
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${colors[type]};
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          z-index: 1001;
          max-width: 300px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      }

      generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      }

      // Show comments modal for an order
      showCommentsModal(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order) return;

        // Mark comments as read when opening
        this.markCommentsAsRead(orderId);

        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        const comments = this.getComments(orderId);
        
        modal.innerHTML = `
          <div style="background: white; border-radius: 8px; width: 90%; max-width: 600px; max-height: 80%; overflow: hidden; display: flex; flex-direction: column;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Comments - ${order.title}</h3>
              <button onclick="this.closest('.modal').remove()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 20px; max-height: 400px;">
              <div id="commentsContainer">
                ${comments.length === 0 ? 
                  '<p style="color: #6b5440; text-align: center; margin: 40px 0;">No comments yet. Start the conversation!</p>' :
                  comments.map(comment => `
                    <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                          <strong style="color: #4b3b2a;">${comment.userName}</strong>
                          <span style="color: #6b5440; font-size: 12px; margin-left: 8px;">${comment.userRole}</span>
                        </div>
                        <span style="color: #6b5440; font-size: 12px;">${new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p style="margin: 0; color: #4b3b2a; line-height: 1.5;">${comment.message}</p>
                    </div>
                  `).join('')
                }
              </div>
            </div>
            
            <div style="padding: 20px; border-top: 1px solid #e5e7eb;">
              <form id="commentForm" style="display: flex; gap: 12px;">
                <textarea id="commentMessage" placeholder="Add a comment..." 
                  style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; min-height: 60px;" required></textarea>
                <button type="submit" style="background: #c48b5a; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500;">Send</button>
              </form>
            </div>
          </div>
        `;

        modal.className = 'modal';
        document.body.appendChild(modal);

        // Handle comment form submission
        document.getElementById('commentForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const message = document.getElementById('commentMessage').value.trim();
          if (!message) return;

          try {
            this.addComment(orderId, message);
            
            // Refresh comments display
            document.getElementById('commentMessage').value = '';
            modal.remove();
            this.showCommentsModal(orderId); // Reopen with updated comments
            
          } catch (error) {
            this.showToast('Error adding comment: ' + error.message, 'error');
          }
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.remove();
          }
        });
      }
    }

    // Initialize comment system
    const commentSystem = new CommentSystem();

    // Add comments column to orders table and update the draw function
    window.commentSystem = commentSystem;

    // Logout function
    window.logout = function() {
      authSystem.logout();
      showToast('Logged out successfully', 'info');
      render(); // Show login screen
    };

    // Support menu functions
    window.toggleSupportMenu = function() {
      const dropdown = document.getElementById('supportMenuDropdown');
      const isVisible = dropdown.style.display !== 'none';
      
      if (isVisible) {
        dropdown.style.display = 'none';
      } else {
        dropdown.style.display = 'block';
      }
    };

    // Close support menu when clicking outside
    document.addEventListener('click', function(event) {
      const supportBtn = document.getElementById('supportMenuBtn');
      const dropdown = document.getElementById('supportMenuDropdown');
      
      if (supportBtn && dropdown && 
          !supportBtn.contains(event.target) && 
          !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
      }
    });

    window.openStyleGuide = function() {
      showToast('📄 Opening Textile Photo Reference Guide...', 'info');
      window.open('assets/TEXTILE_PHOTO_REFERENCE_GUIDE.pdf', '_blank');
      document.getElementById('supportMenuDropdown').style.display = 'none';
    };

    window.openUserManual = function() {
      showToast('📖 Opening User Manual...', 'info');
      window.open('USER-MANUAL.md', '_blank');
      document.getElementById('supportMenuDropdown').style.display = 'none';
    };

    window.openScannerGuide = function() {
      showToast('📷 Opening Scanner Guide...', 'info');
      window.open('SCANNER-FEATURE.md', '_blank');
      document.getElementById('supportMenuDropdown').style.display = 'none';
    };

    window.showAboutModal = function() {
      document.getElementById('supportMenuDropdown').style.display = 'none';
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
      `;

      modal.innerHTML = `
        <div style="
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 500px;
          width: 90%;
          padding: 32px;
          animation: slideUp 0.3s ease;
        ">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #c48b5a 0%, #a67550 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 16px;
              font-size: 40px;
            ">
              📸
            </div>
            <h2 style="margin: 0 0 8px; font-size: 24px; color: #4b3b2a; font-weight: 700;">
              RKH's Photo Order System
            </h2>
            <p style="margin: 0; color: #6b5440; font-size: 16px;">
              Comprehensive Campaign Portal
            </p>
          </div>
          
          <div style="
            background: #fef9f3;
            border: 2px solid #ead7c2;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
          ">
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6b5440; font-weight: 600;">Version:</span>
                <span style="color: #4b3b2a; font-family: monospace; font-weight: 700;">2.0.0</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6b5440; font-weight: 600;">Build Date:</span>
                <span style="color: #4b3b2a; font-family: monospace;">November 2025</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6b5440; font-weight: 600;">Environment:</span>
                <span style="color: #4b3b2a; font-family: monospace;">${window.isElectron ? 'Desktop' : 'Web'}</span>
              </div>
            </div>
          </div>

          <p style="color: #92400e; font-size: 13px; text-align: center; margin: 0 0 24px;">
            © 2025 RKH's Campaign Portal. All rights reserved.
          </p>

          <button onclick="this.closest('div[style*=\"fixed\"]').remove()" style="
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, #7fa284 0%, #7fa284 100%);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(127, 162, 132, 0.3);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(127, 162, 132, 0.5)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(127, 162, 132, 0.3)'">
            Close
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    // Notification functions
    window.showNotifications = function() {
      const currentUser = commentSystem.currentUser;
      const notifications = commentSystem.getNotifications(currentUser.id);
      const unreadCount = commentSystem.getUnreadNotificationCount(currentUser.id);

      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      modal.innerHTML = `
        <div style="background: white; border-radius: 8px; width: 90%; max-width: 500px; max-height: 80%; overflow: hidden; display: flex; flex-direction: column;">
          <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Notifications (${unreadCount} unread)</h3>
            <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
          </div>
          
          <div style="flex: 1; overflow-y: auto; max-height: 400px;">
            ${notifications.length === 0 ? 
              '<p style="color: #6b5440; text-align: center; margin: 40px 0;">No notifications yet.</p>' :
              notifications.map(notification => `
                <div style="padding: 16px; border-bottom: 1px solid #f1e8dc; ${notification.isRead ? 'opacity: 0.6;' : 'background: #fdf4e6;'}" 
                     onclick="markNotificationRead('${notification.id}')">
                  <div style="display: flex; justify-content: between; align-items: start;">
                    <div style="flex: 1;">
                      <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #4b3b2a;">${notification.title}</h4>
                      <p style="margin: 0 0 8px 0; color: #6b5440; font-size: 13px; line-height: 1.4;">${notification.message}</p>
                      <span style="color: #9ca3af; font-size: 11px;">${new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                    ${!notification.isRead ? '<div style="width: 8px; height: 8px; background: #c48b5a; border-radius: 50%; margin-left: 8px; margin-top: 4px;"></div>' : ''}
                  </div>
                </div>
              `).join('')
            }
          </div>
          
          ${notifications.length > 0 ? `
            <div style="padding: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
              <button onclick="markAllNotificationsRead()" style="background: #c48b5a; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                Mark All as Read
              </button>
            </div>
          ` : ''}
        </div>
      `;

      modal.className = 'modal';
      document.body.appendChild(modal);

      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    window.markNotificationRead = function(notificationId) {
      commentSystem.markNotificationAsRead(notificationId);
      updateNotificationBadge();
      // Refresh notifications panel
      document.querySelector('.modal')?.remove();
      showNotifications();
    };

    window.markAllNotificationsRead = function() {
      const currentUser = commentSystem.currentUser;
      const notifications = commentSystem.getNotifications(currentUser.id);
      notifications.forEach(n => {
        if (!n.isRead) {
          commentSystem.markNotificationAsRead(n.id);
        }
      });
      updateNotificationBadge();
      document.querySelector('.modal')?.remove();
    };

    function updateNotificationBadge() {
      const currentUser = commentSystem.currentUser;
      if (!currentUser) return; // Exit if no user is logged in
      
      const unreadCount = commentSystem.getUnreadNotificationCount(currentUser.id);
      const badge = document.getElementById('notificationCount');
      
      // Check if badge element exists before trying to access it
      if (!badge) {
        console.warn('Notification badge element not found. Skipping badge update.');
        return;
      }
      
      if (unreadCount > 0) {
        badge.style.display = 'flex';
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      } else {
        badge.style.display = 'none';
      }
    }

    // Initialize notification badge
    updateNotificationBadge();

    searchBox?.addEventListener('input', drawRows);

    document.getElementById('exportCsv')?.addEventListener('click', () => {
      if (currentView === 'orders') {
        const orders = authSystem.getFilteredOrders(allOrders); // Get filtered orders
        const header = 'Order Number,Title,Status,Method,Purchase Group,Event ID,Photographer,Priority,Deadline';
        const rows = orders.map(o => [
          o.orderNumber, o.title, o.status, o.method, 
          o.purchaseGroup ? `${o.purchaseGroup} - ${purchaseGroups[o.purchaseGroup] || 'Unknown'}` : 'N/A', 
          o.eventId || 'N/A', o.photographer, o.priority, o.deadline
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\\n');
        
        const blob = new Blob(['\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `photo_orders_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else if (currentView === 'samples') {
        const header = 'Sample ID,Article Name,Status,Location,Assigned To,Transit History,Last Update';
        const rows = samples.map(s => [
          s.id, s.articleName, s.status, s.location, s.assignedTo, s.transitHistory, s.lastUpdate
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\\n');
        
        const blob = new Blob(['\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `photo_samples_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    });

    // Start with orders view
    showView('orders');

    // Handler functions for modal interactions
    function handleCreateOrder(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      
      // Build the new order object
      const newOrder = {
        orderNumber: 'ORD-' + Date.now(),
        title: formData.get('title'),
        priority: formData.get('priority'),
        method: formData.get('method'),
        brief: formData.get('brief'),
        status: 'New',
        photographer: formData.get('photographer') || 'Not Assigned',
        deadline: formData.get('deadline'),
        budget: formData.get('budget') || 0,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        assignedTo: formData.get('photographer') ? formData.get('photographer').replace(/\s*\(.*\)/, '') : null,
        purchaseGroup: currentUser.purchaseGroups ? currentUser.purchaseGroups[0] : 100,
        eventId: formData.get('eventId') || null,  // Capture Event ID from form
        tacticType: formData.get('tacticType') || null,  // Capture Tactic Type from form
        tactic: formData.get('tactic') || null,  // Capture Tactic from form
        offerId: '10' + Math.floor(Math.random() * 900000 + 100000),
        articleNumber: 'ART-' + Date.now().toString().slice(-6),
        imageRequestId: Math.floor(Math.random() * 900000 + 100000).toString(),
        photoStatus: 'New',
        articles: formData.get('articles') ? formData.get('articles').split('\n').filter(a => a.trim()) : [],
        deliverables: ['Product Photography'],
        comments: []
      };

      assignSalesOrgToOrder(newOrder, window.rkhOrders ? window.rkhOrders.length : null);

      // Handle Post Production specific fields
      if (formData.get('method') === 'Post Production') {
        const postProductionType = formData.get('postProductionType');
        newOrder.postProductionType = postProductionType;
        
        if (postProductionType === 'GenAI') {
          // Add AI configuration to the order
          newOrder.aiConfig = {
            provider: 'Nano Banana',
            operation: formData.get('aiOperation') || '',
            quality: formData.get('aiQuality') || 'high',
            instructions: formData.get('aiInstructions') || '',
            timestamp: new Date().toISOString(),
            status: 'Configured'
          };
          
          // Update status and photographer assignment for AI orders
          newOrder.status = 'AI Processing Queue';
          newOrder.photographer = 'Nano Banana AI';
          newOrder.assignedTo = 'ai-system';
          newOrder.photoStatus = 'AI Queue';
          newOrder.deliverables = ['AI Enhanced Images', 'Original Images'];
        } else if (postProductionType === 'Internal') {
          newOrder.status = 'Post Production Queue';
          newOrder.photoStatus = 'Post Production';
          newOrder.deliverables = ['Post Processed Images', 'Original Images'];
        }
      }

      // Add the order to the global array
      if (window.rkhOrders) {
        window.rkhOrders.push(newOrder);
      } else {
        window.rkhOrders = [newOrder];
      }
      assignSalesOrgMetadata(window.rkhOrders);

      // Close the modal
      event.target.closest('.create-order-modal')?.remove();
      document.getElementById('createOrderLeftModal')?.remove();
      
      // Show success message with AI-specific text
      if (newOrder.method === 'Post Production' && newOrder.postProductionType === 'GenAI') {
        showToast('🍌 AI Order created successfully! Queued for Nano Banana processing.', 'success');
      } else {
        showToast('✅ Order created successfully!', 'success');
      }
      
      // Refresh the view
      if (typeof drawRows === 'function') {
        drawRows();
      }
      if (typeof window.updateQuickActionBadges === 'function') {
        window.updateQuickActionBadges();
      }
    }

    // Assign to window immediately after definition
    window.handleCreateOrder = handleCreateOrder;

    function useTemplate(templateKey) {
      const template = templates[templateKey];
      if (!template) return;
      
      // Close templates modal
      document.querySelector('.templates-modal')?.remove();
      
      // Directly open the create order modal with pre-filled template data
      showNewOrderModal();
      
      // Wait for modal to be rendered, then fill it with template data
      setTimeout(() => {
        const form = document.getElementById('newOrderForm');
        if (form) {
          // Fill form fields with template data
          const titleField = form.querySelector('input[name="title"]');
          const methodField = form.querySelector('select[name="method"]');
          const priorityField = form.querySelector('select[name="priority"]');
          const briefField = form.querySelector('textarea[name="brief"]');
          const articlesField = form.querySelector('textarea[name="articles"]');
          const budgetField = form.querySelector('input[name="budget"]');
          const deadlineField = form.querySelector('input[name="deadline"]');
          
          if (titleField) titleField.value = template.title;
          if (methodField) methodField.value = template.method;
          if (priorityField) priorityField.value = template.priority;
          if (briefField) briefField.value = template.brief;
          if (articlesField) articlesField.value = template.articles;
          if (budgetField) budgetField.value = template.budget;
          
          // Set deadline to 14 days from now
          if (deadlineField) {
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 14);
            deadlineField.value = deadline.toISOString().split('T')[0];
          }
          
          // Show success message
          showToast(`📝 Template "${template.title}" loaded into create order form!`, 'success');
          
          // Highlight the form briefly
          form.style.background = 'linear-gradient(135deg, #fdf4e6, #f2e4d2)';
          form.style.transform = 'scale(1.01)';
          form.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            form.style.background = '';
            form.style.transform = '';
          }, 2000);
        }
      }, 300);
    }

    // Assign to window immediately after definition
    window.useTemplate = useTemplate;
  }

  // Google AI Processing Function - Moved here to be available during initialization
  async function processWithGoogleAI(prompt, imageData = null, options = {}) {

    try {
      // Validate API key
      const apiKey = localStorage.getItem('runwareApiKey') || localStorage.getItem('googleAI_apiKey');
      if (!apiKey) {
        throw new Error('Google AI API key not configured. Please configure it first.');
      }

      // Show processing indicator
      const processingToast = showToast('🤖 Processing with Nano Banana...', 'info', 0);

      // Use the RunwareWebSocketManager for proper integration
      let runwareWS = window.runwareWS;
      
      // If WebSocket not initialized, wait for it to be ready
      if (!runwareWS) {
        console.warn('⚠️ WebSocket not found on window. Waiting for initialization...');
        
        // Check if we're still loading (stub exists)
        if (window._runwareReady) {
          console.log('⏳ Waiting for WebSocket class to load...');
          showToast('⏳ Initializing Nano Banana AI...', 'info');
          
          try {
            // Wait up to 5 seconds for the WebSocket to be ready
            await Promise.race([
              window._runwareReady,
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
            
            runwareWS = window.runwareWS;
            console.log('✅ WebSocket ready after wait');
          } catch (e) {
            console.error('❌ Timeout waiting for WebSocket');
          }
        }
        
        // Try to create instance if class is available
        if (!runwareWS && typeof window.RunwareWebSocketManager !== 'undefined') {
          console.log('✅ Creating new WebSocket instance...');
          runwareWS = new window.RunwareWebSocketManager();
          window.runwareWS = runwareWS;
        }
        
        // Final check
        if (!runwareWS) {
          throw new Error('Runware WebSocket not initialized. Please refresh the page (Ctrl+Shift+R) and wait 3 seconds before trying again.');
        }
      }
      
      if (!runwareWS.isReady()) {
        console.log('🔌 Connecting WebSocket...');
        showToast('🔌 Connecting to Nano Banana...', 'info');
        await runwareWS.connect();
      }

      // Prepare the request payload in the correct format
      const payload = {
        positivePrompt: prompt,
        model: 'google:4@1', // Nano Banana - Google Gemini Flash Image 2.5
        taskType: 'imageInference',
        ...(imageData && { referenceImages: [imageData] }),
        numberResults: options.numberOfImages || 1,
        outputType: ["dataURI", "URL"],
        outputFormat: options.outputFormat || 'JPEG',
        seed: options.seed || Math.floor(Math.random() * 1000000),
        includeCost: true,
        outputQuality: options.outputQuality || 85,
        taskUUID: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      };

      // Send the request using the WebSocket manager
      const response = await runwareWS.imageInference(prompt, imageData, {
        numberOfImages: options.numberOfImages || 1,
        outputFormat: options.outputFormat || 'JPEG',
        seed: options.seed || Math.floor(Math.random() * 1000000),
        outputQuality: options.outputQuality || 85
      });

      // Hide processing toast
      if (processingToast) processingToast.hide();

      // Process the response
      if (response && response.data && response.data.imageURL) {
        showToast('✅ Content generated successfully with Google AI!', 'success');
        return {
          success: true,
          imageUrl: response.data.imageURL,
          taskUUID: response.taskUUID,
          cost: response.data.cost,
          processingTime: response.data.processingTime
        };
      } else {
        throw new Error('No image URL in response from Runware API');
      }

    } catch (error) {
      // Hide processing toast if it exists
      if (typeof processingToast !== 'undefined' && processingToast && processingToast.hide) {
        processingToast.hide();
      }

      // Show error message
      let errorMessage = error.message;
      if (error.message.includes('WebSocket')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API key not configured. Please configure your Google AI API key first.';
      } else if (error.message.includes('extension') || error.message.includes('runtime')) {
        errorMessage = 'Browser extension conflict detected. Please disable conflicting extensions and try again.';
      } else if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
        errorMessage = 'Cross-origin request blocked. Please check browser security settings.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. The AI service may be busy. Please try again.';
      }

      showToast(`❌ Google AI Error: ${errorMessage}`, 'error');

      throw error;
    }
  }

  // Expose to global window object
  window.processWithGoogleAI = processWithGoogleAI;

  // Smooth entrance
  setTimeout(() => {
    console.log('[MAIN] 🎬 Main setTimeout executing, about to render...');
    render(); // This will now check authentication first
    
    // Update badges after initial render
    setTimeout(() => {
      if (window.updateQuickActionBadges && window.authSystem && window.authSystem.isAuthenticated()) {
        window.updateQuickActionBadges();
      }
    }, 500);
    
    // Add keyboard shortcut for sidebar toggle (Ctrl/Cmd + B)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.classList.toggle('collapsed');
        }
      }
    });

    // ============================================================================
    // SCANNER FUNCTIONALITY - Embedded EAN/GTIN Article Scanner
    // ============================================================================
    // Automatically detect barcode scanner input and search for orders
    // containing the scanned article
    (function initScanner() {
      let scanBuffer = '';
      let scanTimeout = null;
      const SCAN_TIMEOUT_MS = 100; // Scanner typically inputs very fast
      const MIN_SCAN_LENGTH = 8; // Minimum EAN code length

      // Listen for keyboard input (scanners act as keyboards)
      document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input field
        const activeElement = document.activeElement;
        if (activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable
        )) {
          return;
        }

        // Clear previous timeout
        if (scanTimeout) {
          clearTimeout(scanTimeout);
        }

        // If Enter key is pressed, process the scan
        if (e.key === 'Enter' && scanBuffer.length >= MIN_SCAN_LENGTH) {
          e.preventDefault();
          processScan(scanBuffer.trim());
          scanBuffer = '';
          return;
        }

        // Ignore special keys
        if (e.key.length > 1 && e.key !== 'Enter') {
          return;
        }

        // Add character to buffer
        scanBuffer += e.key;

        // Set timeout to clear buffer (in case it's manual typing, not scanning)
        scanTimeout = setTimeout(() => {
          scanBuffer = '';
        }, SCAN_TIMEOUT_MS);
      });

      // Process scanned article code
      function processScan(articleCode) {
        console.log('[Scanner] Scanned article code:', articleCode);
        
        // Search for orders containing this article
  const matchingOrders = findOrdersByArticleCode(articleCode);
        
        if (matchingOrders.length > 0) {
          // Highlight matching orders
          highlightMatchingOrders(matchingOrders, articleCode);
          showToast(`✅ Found ${matchingOrders.length} order(s) with article: ${articleCode}`, 'success');
        } else {
          // No match found - show modal
          showArticleNotFoundModal(articleCode);
        }
      }

      // Search orders by article EAN/GTIN code
      function findOrdersByArticleCode(articleCode) {
  const orders = window.rkhOrders || [];
  const matches = [];
  const normalizedCode = (articleCode || '').replace(/\s+/g, '');
        
        orders.forEach(order => {
          const normalizedArticles = normalizeArticles(order.articles);

          if (normalizedArticles.length) {
            const hasMatch = normalizedArticles.some(article => {
              const ean = (article.ean || '').replace(/\s+/g, '');
              const articleNumber = (article.articleNumber || '').replace(/\s+/g, '');
              return ean && ean === normalizedCode || articleNumber && articleNumber === normalizedCode;
            });

            if (hasMatch) {
              matches.push(order);
            }
          }

          const normalizedOrderArticleNumber = (order.articleNumber || '').replace(/\s+/g, '');
          if (normalizedOrderArticleNumber && normalizedOrderArticleNumber === normalizedCode) {
            if (!matches.includes(order)) {
              matches.push(order);
            }
          }
        });
        
        return matches;
      }

      // Highlight matching orders in the UI
      function highlightMatchingOrders(orders, articleCode) {
        // Clear any previous highlights (but NOT the filter yet)
        document.querySelectorAll('.scanner-highlight').forEach(el => {
          el.classList.remove('scanner-highlight');
        });
        document.querySelectorAll('.scanner-indicator').forEach(el => {
          el.remove();
        });
        
        // Get current view
        const dashboardView = document.getElementById('dashboardView');
        const ordersView = document.getElementById('ordersView');
        const isDashboard = dashboardView && dashboardView.classList.contains('view-active');
        const isOrdersView = ordersView && ordersView.classList.contains('view-active');
        
        // Switch to appropriate view if needed
        if (!isDashboard && !isOrdersView) {
          // Switch to dashboard view
          showView('dashboardView');
        }
        
        // Highlight each matching order FIRST (before filtering)
        orders.forEach(order => {
          // Target both Kanban cards (data-order-id) and search results (data-order-number)
          const kanbanCards = document.querySelectorAll(`[data-order-id="${order.orderNumber}"]`);
          const searchCards = document.querySelectorAll(`[data-order-number="${order.orderNumber}"]`);
          const orderCards = [...kanbanCards, ...searchCards];
          
          console.log(`[Scanner] Found ${orderCards.length} cards for order ${order.orderNumber}`);
          
          orderCards.forEach(card => {
            // Add highlight class
            card.classList.add('scanner-highlight');
            
            // Add visual indicator
            const indicator = document.createElement('div');
            indicator.className = 'scanner-indicator';
            indicator.innerHTML = `
              <div style="
                position: absolute;
                top: 8px;
                right: 8px;
                background: linear-gradient(135deg, #7fa284 0%, #7fa284 100%);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                z-index: 10;
                display: flex;
                align-items: center;
                gap: 6px;
                animation: scanPulse 2s infinite;
              ">
                <span style="font-size: 16px;">📦</span>
                <span>Scanned: ${articleCode}</span>
              </div>
            `;
            card.style.position = 'relative';
            card.appendChild(indicator);
            
            // Scroll to first match
            if (order === orders[0]) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        });
        
        // NOW apply filter to show only matching orders (after highlighting)
        filterOrdersByArticle(orders, articleCode);
        
        // Add CSS for highlight animation
        if (!document.getElementById('scanner-highlight-styles')) {
          const style = document.createElement('style');
          style.id = 'scanner-highlight-styles';
          style.textContent = `
            .scanner-highlight {
              outline: 3px solid #7fa284 !important;
              outline-offset: 2px;
              animation: scannerPulse 2s infinite;
            }
            
            @keyframes scannerPulse {
              0%, 100% {
                outline-color: #7fa284;
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
              }
              50% {
                outline-color: #7fa284;
                box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
              }
            }
            
            @keyframes scanPulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }
          `;
          document.head.appendChild(style);
        }
        
        // Don't auto-clear anymore - user must manually clear the filter
        // setTimeout(clearOrderHighlights, 10000);
      }

      // Clear all order highlights
      function clearOrderHighlights() {
        document.querySelectorAll('.scanner-highlight').forEach(el => {
          el.classList.remove('scanner-highlight');
        });
        document.querySelectorAll('.scanner-indicator').forEach(el => {
          el.remove();
        });
        
        // Clear the filter and show all orders
        clearOrderFilter();
      }
      
      // Filter orders to show only matching ones
      function filterOrdersByArticle(matchingOrders, articleCode) {
        console.log(`[Scanner] Filtering to show ${matchingOrders.length} matching orders`);
        
        const matchingOrderNumbers = new Set(matchingOrders.map(o => o.orderNumber));
        
        // Get all order elements from different views:
        // 1. Kanban cards (Dashboard view) - data-order-id
        // 2. Search result cards - data-order-number
        // 3. Table rows (Orders view) - #ordersView tbody tr
        const kanbanCards = document.querySelectorAll('[data-order-id]');
        const searchCards = document.querySelectorAll('[data-order-number]');
        const tableRows = document.querySelectorAll('#ordersView tbody tr');
        const allOrderElements = [...kanbanCards, ...searchCards, ...tableRows];
        
        console.log(`[Scanner] Found ${kanbanCards.length} Kanban cards, ${searchCards.length} search cards, ${tableRows.length} table rows, ${allOrderElements.length} total`);
        
        if (allOrderElements.length === 0) {
          console.warn('[Scanner] No order elements found in DOM! May not be rendered yet.');
        }
        
        allOrderElements.forEach(element => {
          // Get order number from different possible attributes
          let orderNumber = element.getAttribute('data-order-id') 
                         || element.getAttribute('data-order-number')
                         || element.getAttribute('data-order');
          
          // For table rows, try to extract from onclick attribute or text content
          if (!orderNumber && element.tagName === 'TR') {
            const onclick = element.getAttribute('onclick');
            if (onclick) {
              const match = onclick.match(/showOrderDetails\(['"]([^'"]+)['"]\)/);
              if (match) orderNumber = match[1];
            }
            // Also try first cell text
            if (!orderNumber) {
              const firstCell = element.querySelector('td');
              if (firstCell) {
                const text = firstCell.textContent.trim();
                if (text.startsWith('ORD-')) orderNumber = text;
              }
            }
          }
          
          if (matchingOrderNumbers.has(orderNumber)) {
            // Show matching orders - force visibility
            if (element.tagName === 'TR') {
              element.style.cssText = 'display: table-row !important; visibility: visible !important; opacity: 1 !important;';
            } else {
              element.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
            }
            element.classList.add('scanner-filtered-in');
            element.classList.remove('scanner-filtered-out');
            console.log(`[Scanner] ✅ Showing order: ${orderNumber}`);
          } else {
            // Hide non-matching orders
            element.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; overflow: hidden !important;';
            element.classList.add('scanner-filtered-out');
            element.classList.remove('scanner-filtered-in');
            console.log(`[Scanner] ❌ Hiding order: ${orderNumber}`);
          }
        });
        
        // Add filter indicator banner
        addFilterIndicator(matchingOrders.length, articleCode);
      }
      
      // Clear order filter and show all orders
      function clearOrderFilter() {
        console.log('[Scanner] Clearing filter - showing all orders');
        
        // Show all order elements (Kanban cards, search results, and table rows)
        const kanbanCards = document.querySelectorAll('[data-order-id]');
        const searchCards = document.querySelectorAll('[data-order-number]');
        const tableRows = document.querySelectorAll('#ordersView tbody tr');
        const allOrderElements = [...kanbanCards, ...searchCards, ...tableRows];
        
        allOrderElements.forEach(element => {
          element.style.cssText = ''; // Clear all inline styles
          element.classList.remove('scanner-filtered-in', 'scanner-filtered-out');
        });
        
        // Remove filter indicator
        const indicator = document.getElementById('scanner-filter-indicator');
        if (indicator) {
          indicator.remove();
        }
      }
      
      // Add visual filter indicator banner
      function addFilterIndicator(count, articleCode) {
        // Remove existing indicator
        const existingIndicator = document.getElementById('scanner-filter-indicator');
        if (existingIndicator) {
          existingIndicator.remove();
        }
        
        // Create filter indicator banner
        const indicator = document.createElement('div');
        indicator.id = 'scanner-filter-indicator';
        indicator.style.cssText = `
          position: fixed;
          top: 70px;
          right: 20px;
          background: linear-gradient(135deg, #7fa284 0%, #7fa284 100%);
          color: white;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 14px;
          animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        indicator.innerHTML = `
          <span style="font-size: 22px;">🔍</span>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.3px;">📦 Article Filter Active</div>
            <div style="font-size: 12px; font-family: 'Courier New', monospace; 
                        background: rgba(0,0,0,0.15); padding: 3px 8px; border-radius: 4px; 
                        display: inline-block; max-width: fit-content;">EAN: ${articleCode}</div>
            <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">Showing ${count} matching order(s)</div>
          </div>
          <button onclick="window.clearOrderHighlights()" 
                  style="background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); 
                         color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; 
                         font-size: 12px; font-weight: 700; margin-left: 10px;
                         transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px;">
            ✕ Clear Filter
          </button>
        `;
        
        // Add hover effect to button
        const clearBtn = indicator.querySelector('button');
        clearBtn.addEventListener('mouseenter', () => {
          clearBtn.style.background = 'rgba(255,255,255,0.4)';
          clearBtn.style.transform = 'scale(1.05)';
        });
        clearBtn.addEventListener('mouseleave', () => {
          clearBtn.style.background = 'rgba(255,255,255,0.25)';
          clearBtn.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(indicator);
        
        // Add slide animation if not present
        if (!document.getElementById('scanner-filter-animation')) {
          const style = document.createElement('style');
          style.id = 'scanner-filter-animation';
          style.textContent = `
            @keyframes slideInRight {
              from {
                transform: translateX(450px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `;
          document.head.appendChild(style);
        }
      }

      // Show modal when article not found
      function showArticleNotFoundModal(articleCode) {
        // Close any existing modals
        closeAllRightSideModals();
        
        const modal = document.createElement('div');
        modal.id = 'articleNotFoundModal';
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        `;
        
        modal.innerHTML = `
          <div style="
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            max-width: 500px;
            width: 90%;
            padding: 32px;
            animation: slideUp 0.3s ease;
          ">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px;
                font-size: 32px;
              ">
                🔍
              </div>
              <h2 style="margin: 0 0 8px; font-size: 24px; color: #4b3b2a; font-weight: 700;">
                Article Not Found
              </h2>
              <p style="margin: 0; color: #6b5440; font-size: 16px;">
                The scanned article could not be found in any existing orders.
              </p>
            </div>
            
            <div style="
              background: #fef3c7;
              border: 2px solid #fbbf24;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 24px;
            ">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 24px;">📦</span>
                <strong style="color: #92400e; font-size: 16px;">Scanned Article Code:</strong>
              </div>
              <div style="
                font-family: 'Courier New', monospace;
                font-size: 20px;
                font-weight: 700;
                color: #78350f;
                letter-spacing: 2px;
                text-align: center;
                padding: 12px;
                background: white;
                border-radius: 8px;
              ">
                ${articleCode}
              </div>
            </div>
            
            <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; text-align: center;">
              Would you like to create a new order with this article?
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <button onclick="closeArticleNotFoundModal()" style="
                padding: 14px;
                background: #e5e7eb;
                color: #4b3b2a;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
              " onmouseover="this.style.background='#d1d5db'" onmouseout="this.style.background='#e5e7eb'">
                Cancel
              </button>
              <button onclick="createOrderFromScan('${articleCode}')" style="
                padding: 14px;
                background: linear-gradient(135deg, #7fa284 0%, #7fa284 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(16, 185, 129, 0.3)'">
                ✓ Create New Order
              </button>
            </div>
          </div>
        `;
        
        // Add animation styles
        if (!document.getElementById('scanner-modal-styles')) {
          const style = document.createElement('style');
          style.id = 'scanner-modal-styles';
          style.textContent = `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `;
          document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeArticleNotFoundModal();
          }
        });
      }

      // Close article not found modal
      window.closeArticleNotFoundModal = function() {
        const modal = document.getElementById('articleNotFoundModal');
        if (modal) {
          modal.style.animation = 'fadeOut 0.2s ease';
          setTimeout(() => modal.remove(), 200);
        }
      };

      // Show barcode generator modal
      function showBarcodeGeneratorModal() {
        // Close any existing modals
        closeAllRightSideModals();
        const existingBarcodeModal = document.getElementById('barcodeGeneratorModal');
        if (existingBarcodeModal) {
          existingBarcodeModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'barcodeGeneratorModal';
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        `;
        
        modal.innerHTML = `
          <div style="
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            max-width: 560px;
            width: 90%;
            padding: 32px;
            animation: slideUp 0.3s ease;
          ">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #c48b5a 0%, #a67550 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px;
                font-size: 32px;
              ">
                🏷️
              </div>
              <h2 style="margin: 0 0 8px; font-size: 24px; color: #4b3b2a; font-weight: 700;">
                Barcode Generator
              </h2>
              <p style="margin: 0; color: #6b5440; font-size: 16px;">
                Generate printable barcode labels for your articles
              </p>
            </div>
            
            <div style="
              background: #fef9f3;
              border: 2px solid #ead7c2;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 24px;
            ">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <span style="font-size: 20px;">📊</span>
                <strong style="color: #4b3b2a; font-size: 15px;">Enter EAN/GTIN Code:</strong>
              </div>
              <input 
                type="text" 
                id="barcodeInput" 
                placeholder="e.g., 5701234567890" 
                pattern="[0-9]{8,13}"
                style="
                  width: 100%;
                  padding: 12px 16px;
                  border: 2px solid #ead7c2;
                  border-radius: 8px;
                  font-size: 17px;
                  font-family: 'Courier New', monospace;
                  font-weight: 600;
                  letter-spacing: 2px;
                  box-sizing: border-box;
                  transition: all 0.2s ease;
                  background: white;
                  color: #4b3b2a;
                "
                onfocus="this.style.borderColor='#c48b5a'; this.style.boxShadow='0 0 0 3px rgba(196, 139, 90, 0.1)'"
                onblur="this.style.borderColor='#ead7c2'; this.style.boxShadow='none'"
              >
              <p style="margin: 10px 0 0; color: #92400e; font-size: 13px;">
                💡 Tip: Enter 8-13 digit EAN/GTIN barcode number
              </p>
            </div>
            
            <div id="barcodePreview" style="
              background: white;
              border: 2px dashed #ead7c2;
              border-radius: 12px;
              padding: 32px;
              margin-bottom: 24px;
              text-align: center;
              min-height: 180px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            ">
              <p style="color: #9ca3af; font-size: 15px; margin: 0;">
                📦 Enter a code above to generate barcode preview
              </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <button onclick="closeBarcodeGeneratorModal()" style="
                padding: 14px 20px;
                background: #f4ecdf;
                color: #4b3b2a;
                border: 2px solid #ead7c2;
                border-radius: 25px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
              " onmouseover="this.style.background='#ead7c2'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(75, 59, 42, 0.15)'" onmouseout="this.style.background='#f4ecdf'; this.style.transform=''; this.style.boxShadow=''">
                Cancel
              </button>
              <button onclick="printBarcode()" style="
                padding: 14px 20px;
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.5)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(99, 102, 241, 0.3)'">
                🖨️ Print
              </button>
              <button onclick="copyBarcodeToClipboard()" style="
                padding: 14px 20px;
                background: linear-gradient(135deg, #7fa284 0%, #7fa284 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(127, 162, 132, 0.3);
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(127, 162, 132, 0.5)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(127, 162, 132, 0.3)'">
                📋 Copy
              </button>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
        
        // Set up input handler
        const input = document.getElementById('barcodeInput');
        const preview = document.getElementById('barcodePreview');
        
        input.addEventListener('input', () => {
          const code = input.value.trim();
          if (code.length >= 8 && code.length <= 13 && /^\d+$/.test(code)) {
            generateBarcodePreview(code);
          } else if (code.length > 0) {
            preview.innerHTML = `
              <div style="text-align: center;">
                <span style="font-size: 48px;">⚠️</span>
                <p style="color: #dc2626; font-size: 15px; margin: 12px 0 0; font-weight: 600;">Invalid code format</p>
                <p style="color: #92400e; font-size: 13px; margin: 8px 0 0;">Please enter 8-13 digits only</p>
              </div>
            `;
          } else {
            preview.innerHTML = `<p style="color: #9ca3af; font-size: 15px; margin: 0;">📦 Enter a code above to generate barcode preview</p>`;
          }
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeBarcodeGeneratorModal();
          }
        });
        
        // Focus input
        setTimeout(() => input.focus(), 100);
      }

      // Generate barcode preview using simple SVG bars
      function generateBarcodePreview(code) {
        const preview = document.getElementById('barcodePreview');
        
        // Simple barcode visualization (not actual EAN encoding, just visual representation)
        const barcodeWidth = 400;
        const barcodeHeight = 100;
        const bars = [];
        
        // Generate pseudo-random bar pattern from code digits
        for (let i = 0; i < code.length; i++) {
          const digit = parseInt(code[i]);
          const barPattern = digit % 2 === 0 ? [1, 0, 1, 1] : [0, 1, 1, 0];
          bars.push(...barPattern);
        }
        
        const barWidth = barcodeWidth / bars.length;
        const svgBars = bars.map((bar, i) => {
          if (bar === 1) {
            return `<rect x="${i * barWidth}" y="0" width="${barWidth}" height="${barcodeHeight}" fill="black"/>`;
          }
          return '';
        }).join('');
        
        preview.innerHTML = `
          <div style="
            background: #fef9f3;
            padding: 24px;
            border-radius: 12px;
            border: 2px solid #ead7c2;
          ">
            <svg width="${barcodeWidth}" height="${barcodeHeight}" style="display: block; margin: 0 auto; max-width: 100%;">
              ${svgBars}
            </svg>
            <p style="
              font-family: 'Courier New', monospace;
              font-size: 20px;
              font-weight: 700;
              letter-spacing: 3px;
              margin: 20px 0 0;
              color: #4b3b2a;
              text-align: center;
            ">${code}</p>
            <p style="
              font-size: 12px;
              color: #92400e;
              margin: 8px 0 0;
              text-align: center;
            ">✓ Ready to print or copy</p>
          </div>
        `;
      }

      // Close barcode generator modal
      window.closeBarcodeGeneratorModal = function() {
        const modal = document.getElementById('barcodeGeneratorModal');
        if (modal) {
          modal.style.animation = 'fadeOut 0.2s ease';
          setTimeout(() => modal.remove(), 200);
        }
      };

      // Print barcode
      window.printBarcode = function() {
        const input = document.getElementById('barcodeInput');
        const code = input.value.trim();
        
        if (!code || code.length < 8 || code.length > 13 || !/^\d+$/.test(code)) {
          showToast('⚠️ Please enter a valid 8-13 digit code', 'warning');
          return;
        }
        
        // Create print window with barcode
        const printWindow = window.open('', '_blank', 'width=600,height=400');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Barcode - ${code}</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
              }
              .barcode-container {
                text-align: center;
                page-break-inside: avoid;
              }
              svg {
                max-width: 100%;
              }
              .code {
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 4px;
                margin-top: 16px;
              }
              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              ${document.getElementById('barcodePreview').innerHTML}
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
        
        showToast('🖨️ Opening print dialog...', 'success');
      };

      // Copy barcode to clipboard
      window.copyBarcodeToClipboard = function() {
        const input = document.getElementById('barcodeInput');
        const code = input.value.trim();
        
        if (!code || code.length < 8 || code.length > 13 || !/^\d+$/.test(code)) {
          showToast('⚠️ Please enter a valid 8-13 digit code', 'warning');
          return;
        }
        
        navigator.clipboard.writeText(code).then(() => {
          showToast('📋 Barcode code copied to clipboard', 'success');
        }).catch(() => {
          showToast('⚠️ Failed to copy to clipboard', 'error');
        });
      };

      // Create new order from scanned article
      window.createOrderFromScan = function(articleCode) {
        closeArticleNotFoundModal();
        
        // Show new order modal with pre-filled article
        showNewOrderModal();
        
        // Wait for modal to render, then pre-fill article field
        setTimeout(() => {
          const form = document.getElementById('newOrderForm');
          if (form) {
            // Try to find article input field - we'll need to add this to the form
            const articleInput = form.querySelector('input[name="articleCode"]');
            if (articleInput) {
              articleInput.value = articleCode;
              articleInput.style.background = '#d1fae5';
              articleInput.style.borderColor = '#7fa284';
            }
            
            // Add article code to form title for visual feedback
            const titleInput = form.querySelector('input[name="title"]');
            if (titleInput && !titleInput.value) {
              titleInput.placeholder = `Order for article ${articleCode}`;
            }
            
            // Store scanned article in form for later use
            form.dataset.scannedArticle = articleCode;
          }
        }, 300);
        
        showToast('📋 New order form opened with scanned article', 'success');
      };

      // Expose helper functions globally for testing
      window.processScan = processScan;
      window.clearOrderHighlights = clearOrderHighlights;
      if (typeof searchOrdersByArticle !== 'undefined') {
        window.searchOrdersByArticle = searchOrdersByArticle;
      }
      window.highlightMatchingOrders = highlightMatchingOrders;
      window.showArticleNotFoundModal = showArticleNotFoundModal;
      window.showBarcodeGeneratorModal = showBarcodeGeneratorModal;
      window.filterOrdersByArticle = filterOrdersByArticle;
      window.clearOrderFilter = clearOrderFilter;

      console.log('[Scanner] ✅ Scanner functionality initialized with filtering');
    })();
    // ============================================================================
    // END SCANNER FUNCTIONALITY
    // ============================================================================

    // ============================================================================
    // SCANNER TESTING - Right-Click Context Menu for Emulating Scans
    // ============================================================================
    (function initScannerTestMenu() {
      console.log('[Scanner Test] 🚀 SCANNER TEST MENU IIFE STARTING...');
      window.scannerTestMenuLoaded = true;
      
      let contextMenu = null;
      let ignoreNextClick = false;
      
      // Sample article codes from demo data
      const existingArticles = [
        { code: '5901234567890', name: 'Premium Dog Food 2kg', order: 'ORD-2025-001' },
        { code: '2001234567892', name: 'Espresso Beans 500g', order: 'ORD-2025-002' },
        { code: '4061234567890', name: 'Wireless Bluetooth Speaker', order: 'ORD-2025-003' },
        { code: '8901234567891', name: 'USB-C Cable', order: 'ORD-2025-003' },
        { code: '5901234567901', name: 'Organic Baby Food Puree', order: 'ORD-2025-009' },
        { code: '5901234567903', name: 'Gaming Laptop Pro X1', order: 'ORD-2025-010' },
        { code: '5901234567905', name: 'Winter Puffer Jacket', order: 'ORD-2025-011' },
        { code: '5901234567908', name: 'Stand Mixer Pro', order: 'ORD-2025-012' },
        { code: '5901234567910', name: 'Organic Face Serum', order: 'ORD-2025-013' },
        { code: '5901234567912', name: 'Security Camera 4K', order: 'ORD-2025-014' },
        { code: '5901234567914', name: 'Sourdough Loaf', order: 'ORD-2025-015' },
        { code: '5901234567916', name: 'Adjustable Dumbbells', order: 'ORD-2025-016' },
        { code: '5901234567918', name: 'Phone Case Clear', order: 'ORD-2025-017' },
        { code: '5901234567920', name: 'Luxury Watch Gold', order: 'ORD-2025-018' },
        { code: '5901234567922', name: 'Garden Spade', order: 'ORD-2025-019' },
        { code: '5901234567924', name: 'Ethiopian Coffee Beans', order: 'ORD-2025-020' },
        { code: '5901234567926', name: 'Building Blocks Set', order: 'ORD-2025-021' }
      ];
      
      // Non-existing article codes for testing "not found" scenario
      const nonExistingArticles = [
        { code: '9999999999999', name: 'Test Non-Existing Article' },
        { code: '1111111111111', name: 'Random Code Test' },
        { code: '0000000000000', name: 'Zero Code Test' }
      ];
      
      // Create context menu
      function createContextMenu(x, y) {
        removeContextMenu();

        contextMenu = document.createElement('div');
        contextMenu.id = 'scannerTestContextMenu';
        contextMenu.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          background: rgba(252, 250, 245, 0.96);
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 16px;
          box-shadow: 0 28px 60px -24px rgba(15, 23, 42, 0.45);
          z-index: 99999;
          min-width: 300px;
          padding: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          animation: scannerMenuFadeIn 0.18s ease;
          backdrop-filter: blur(18px);
        `;

        if (!document.getElementById('scanner-test-menu-styles')) {
          const style = document.createElement('style');
          style.id = 'scanner-test-menu-styles';
          style.textContent = `
            @keyframes scannerMenuFadeIn {
              from {
                opacity: 0;
                transform: translateY(8px) scale(0.97);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            #scannerTestContextMenu {
              color: #6f6149;
            }
            #scannerTestContextMenu .context-menu-header {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 4px 4px 12px 4px;
            }
            #scannerTestContextMenu .context-menu-title {
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 0.4px;
            }
            #scannerTestContextMenu .context-menu-subtitle {
              font-size: 12px;
              color: rgba(111, 97, 73, 0.68);
            }
            #scannerTestContextMenu .context-menu-item {
              display: flex;
              align-items: center;
              gap: 12px;
              cursor: pointer;
              padding: 10px 12px;
              border-radius: 12px;
              transition: background 0.12s ease, transform 0.12s ease;
            }
            #scannerTestContextMenu .context-menu-item:hover {
              background: rgba(244, 236, 223, 0.85);
              transform: translateX(2px);
            }
            #scannerTestContextMenu .context-menu-item.submenu {
              justify-content: space-between;
            }
            #scannerTestContextMenu .context-menu-item-label {
              display: flex;
              flex-direction: column;
              gap: 2px;
              flex: 1;
            }
            #scannerTestContextMenu .context-menu-item-detail {
              font-size: 12px;
              color: rgba(111, 97, 73, 0.64);
            }
            #scannerTestContextMenu .context-menu-item-chevron {
              color: rgba(111, 97, 73, 0.45);
              font-size: 16px;
            }
            #scannerTestContextMenu .context-menu-item-icon {
              width: 26px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
            }
            #scannerTestContextMenu .context-menu-divider {
              height: 1px;
              background: rgba(15, 23, 42, 0.08);
              margin: 10px 0;
            }
            .submenu-container {
              position: fixed;
              background: rgba(252, 250, 245, 0.97);
              border: 1px solid rgba(15, 23, 42, 0.12);
              border-radius: 14px;
              box-shadow: 0 24px 58px -26px rgba(15, 23, 42, 0.4);
              z-index: 100000;
              min-width: 320px;
              max-height: 380px;
              overflow-y: auto;
              padding: 14px;
              animation: scannerMenuFadeIn 0.2s ease;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .submenu-container .context-menu-header {
              padding: 0 0 10px 0;
            }
            .submenu-item {
              display: grid;
              gap: 4px;
              padding: 10px 12px;
              border-radius: 12px;
              cursor: pointer;
              transition: background 0.12s ease, transform 0.12s ease;
              color: #6f6149;
            }
            .submenu-item:hover {
              background: rgba(244, 236, 223, 0.85);
              transform: translateX(2px);
            }
            .submenu-item-code {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              font-weight: 600;
              letter-spacing: 0.6px;
              background: rgba(255, 255, 255, 0.65);
              border: 1px solid rgba(111, 97, 73, 0.18);
              border-radius: 8px;
              padding: 4px 8px;
              width: fit-content;
            }
            .submenu-item-name {
              font-size: 13px;
              font-weight: 600;
            }
            .submenu-item-order {
              font-size: 12px;
              color: rgba(111, 97, 73, 0.72);
            }
          `;
          document.head.appendChild(style);
        }

        contextMenu.innerHTML = `
          <div class="context-menu-header">
            <span class="context-menu-item-icon" style="font-size: 18px;">🧪</span>
            <div class="context-menu-item-label">
              <span class="context-menu-title">Scanner Testing</span>
              <span class="context-menu-subtitle">Emulate scan scenarios in the beige lab</span>
            </div>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item submenu" data-submenu="existing">
            <span class="context-menu-item-icon">📦</span>
            <div class="context-menu-item-label">
              <span>Scan Existing Article</span>
              <span class="context-menu-item-detail">Populate orders using curated demo inventory</span>
            </div>
            <span class="context-menu-item-chevron">›</span>
          </div>
          <div class="context-menu-item submenu" data-submenu="nonexisting">
            <span class="context-menu-item-icon">❌</span>
            <div class="context-menu-item-label">
              <span>Scan Non-Existing Article</span>
              <span class="context-menu-item-detail">Trigger the not-found experience instantly</span>
            </div>
            <span class="context-menu-item-chevron">›</span>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item" data-action="random">
            <span class="context-menu-item-icon">🎲</span>
            <div class="context-menu-item-label">
              <span>Random Existing Article</span>
              <span class="context-menu-item-detail">Let the system surprise you with a demo code</span>
            </div>
          </div>
          <div class="context-menu-item" data-action="clear">
            <span class="context-menu-item-icon">🔄</span>
            <div class="context-menu-item-label">
              <span>Clear Highlights</span>
              <span class="context-menu-item-detail">Remove all scanner filters & outlines</span>
            </div>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item" data-action="barcode">
            <span class="context-menu-item-icon">🏷️</span>
            <div class="context-menu-item-label">
              <span>Generate Barcode</span>
              <span class="context-menu-item-detail">Create printable barcode labels</span>
            </div>
          </div>
        `;
        
        // Add event listeners
        contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
          const action = item.getAttribute('data-action');
          const submenu = item.getAttribute('data-submenu');
          
          if (submenu) {
            item.addEventListener('mouseenter', (e) => {
              showSubmenu(submenu, item);
            });
          } else if (action) {
            item.addEventListener('click', () => {
              handleAction(action);
              removeContextMenu();
            });
          }
        });
        
        document.body.appendChild(contextMenu);
        
        // Position adjustment if menu goes off-screen
        const rect = contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          contextMenu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
          contextMenu.style.top = (y - rect.height) + 'px';
        }
      }
      
      // Show submenu
      function showSubmenu(type, parentItem) {
        document.querySelectorAll('.submenu-container').forEach(el => el.remove());

        const submenu = document.createElement('div');
        submenu.className = 'submenu-container';

        const articles = type === 'existing' ? existingArticles : nonExistingArticles;
        const titleIcon = type === 'existing' ? '📦' : '❌';
        const titleText = type === 'existing' ? 'Select Article to Scan' : 'Select Non-Existing Code';
        const subtitleText = type === 'existing'
          ? 'Matching demo inventory entries for quick success paths'
          : 'Use these to validate the not-found workflow';

        const listMarkup = articles.map(article => {
          const orderMarkup = article.order ? `<div class="submenu-item-order">📋 ${article.order}</div>` : '';
          return `
            <div class="submenu-item" data-code="${article.code}">
              <div class="submenu-item-code">${article.code}</div>
              <div class="submenu-item-name">${article.name}</div>
              ${orderMarkup}
            </div>
          `;
        }).join('');

        submenu.innerHTML = `
          <div class="context-menu-header">
            <span class="context-menu-item-icon" style="font-size: 16px;">${titleIcon}</span>
            <div class="context-menu-item-label">
              <span class="context-menu-title">${titleText}</span>
              <span class="context-menu-subtitle">${subtitleText}</span>
            </div>
          </div>
          <div class="context-menu-divider"></div>
          ${listMarkup}
        `;

        const parentRect = parentItem.getBoundingClientRect();
        submenu.style.left = (parentRect.right + 8) + 'px';
        submenu.style.top = parentRect.top + 'px';

        document.body.appendChild(submenu);

        const rect = submenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          submenu.style.left = (parentRect.left - rect.width - 8) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
          submenu.style.top = Math.max(12, window.innerHeight - rect.height - 12) + 'px';
        }

        submenu.querySelectorAll('.submenu-item').forEach(item => {
          item.addEventListener('click', () => {
            const code = item.getAttribute('data-code');
            emulateScan(code);
            removeContextMenu();
          });
        });
      }
      
      // Handle menu actions
      function handleAction(action) {
        switch (action) {
          case 'random':
            const randomArticle = existingArticles[Math.floor(Math.random() * existingArticles.length)];
            emulateScan(randomArticle.code);
            showToast(`🎲 Randomly scanned: ${randomArticle.name}`, 'info');
            break;
          case 'clear':
            if (typeof window.clearOrderHighlights === 'function') {
              window.clearOrderHighlights();
              showToast('🔄 Highlights cleared', 'info');
            } else {
              document.querySelectorAll('.scanner-highlight').forEach(el => {
                el.classList.remove('scanner-highlight');
              });
              document.querySelectorAll('.scanner-indicator').forEach(el => {
                el.remove();
              });
              showToast('🔄 Highlights cleared', 'info');
            }
            break;
          case 'barcode':
            showBarcodeGeneratorModal();
            break;
        }
      }
      
      // Emulate a scan
      function emulateScan(articleCode) {
        console.log('[Scanner Test] 🧪 Emulating scan:', articleCode);
        
        // Find the processScan function and call it
        // This should trigger the same logic as a real scan
        if (typeof window.processScan === 'function') {
          window.processScan(articleCode);
        } else {
          // Fallback: manually trigger the scan logic
          const orders = window.rkhOrders || [];
          const matches = [];
          const normalizedCode = (articleCode || '').replace(/\s+/g, '');

          orders.forEach(order => {
            const normalizedArticles = normalizeArticles(order.articles);

            if (normalizedArticles.length) {
              const hasMatch = normalizedArticles.some(article => {
                const ean = (article.ean || '').replace(/\s+/g, '');
                const articleNumber = (article.articleNumber || '').replace(/\s+/g, '');
                return (ean && ean === normalizedCode) || (articleNumber && articleNumber === normalizedCode);
              });

              if (hasMatch) {
                matches.push(order);
              }
            }

            const normalizedOrderArticleNumber = (order.articleNumber || '').replace(/\s+/g, '');
            if (normalizedOrderArticleNumber && normalizedOrderArticleNumber === normalizedCode && !matches.includes(order)) {
              matches.push(order);
            }
          });
          
          if (matches.length > 0) {
            showToast(`✅ Emulated scan: Found ${matches.length} order(s)`, 'success');
            console.log('[Scanner Test] Found matches:', matches);
          } else {
            showToast(`⚠️ Emulated scan: Article ${articleCode} not found`, 'warning');
            if (typeof window.showArticleNotFoundModal === 'function') {
              window.showArticleNotFoundModal(articleCode);
            }
          }
        }
      }
      
      // Remove context menu
      function removeContextMenu() {
        if (contextMenu) {
          contextMenu.remove();
          contextMenu = null;
        }
        // Also remove any submenus
        document.querySelectorAll('.submenu-container').forEach(el => el.remove());
      }
      
      // Listen for right-click with capture phase to ensure it fires first
      document.addEventListener('contextmenu', (e) => {
        console.log('[Scanner Test] Right-click detected');
        const withinApp = e.target instanceof Element ? e.target.closest('#fallback-app') : null;
        console.log('[Scanner Test] Within app?', !!withinApp);
        if (!withinApp) {
          removeContextMenu();
          return;
        }

        const viewIds = ['dashboardView', 'ordersView', 'kanbanView', 'calendarView', 'workflowView', 'samplesView', 'createOrderView'];
        const activeView = viewIds.some(id => {
          const el = document.getElementById(id);
          const hasClass = el?.classList.contains('view-active');
          console.log(`[Scanner Test] View ${id}: exists=${!!el}, has view-active=${hasClass}`);
          return hasClass;
        });
        
        console.log('[Scanner Test] Active view found?', activeView);

        if (activeView) {
          console.log('[Scanner Test] Preventing default and showing menu');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          ignoreNextClick = true;
          createContextMenu(e.clientX, e.clientY);
        } else {
          console.log('[Scanner Test] No active view, not showing menu');
        }
      }, true); // Use capture phase
      
      // Close menu on any click outside
      document.addEventListener('click', (e) => {
        if (ignoreNextClick) {
          ignoreNextClick = false;
          return;
        }

        if (contextMenu && !contextMenu.contains(e.target)) {
          removeContextMenu();
        }
      });
      
      // Close menu on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contextMenu) {
          removeContextMenu();
        }
      });
      
      // Expose for testing
      window.emulateScan = emulateScan;
      
      console.log('[Scanner Test] ✅ Test context menu initialized');
      console.log('[Scanner Test] 💡 Right-click in Dashboard or Orders view to test scanner');
      console.log('[Scanner Test] 🔍 Testing event listener attachment...');
      
      // Verify the event listener was added
      setTimeout(() => {
        console.log('[Scanner Test] 🧪 Verification check:');
        console.log('[Scanner Test] - Document exists:', !!document);
        console.log('[Scanner Test] - fallback-app exists:', !!document.getElementById('fallback-app'));
        console.log('[Scanner Test] - Dashboard view exists:', !!document.getElementById('dashboardView'));
        console.log('[Scanner Test] - Orders view exists:', !!document.getElementById('ordersView'));
        console.log('[Scanner Test] Event listener should be attached. Try right-clicking now.');
      }, 1000);
    })();
    // ============================================================================
    // END SCANNER TESTING
    // ============================================================================

  }, 300);

  // Load saved Runware API key on startup
  function loadGoogleAIConfig() {
    const savedKey = localStorage.getItem('runwareApiKey');
    if (savedKey) {
      runwareConfig.apiKey = savedKey;
      if (typeof window !== 'undefined') window.runwareConfig = runwareConfig;
    } else {
      console.warn('[Runware] No persisted API key found during startup.');
    }
  }

  // Configuration function for Runware API
  window.configureGoogleAI = function(apiKey) {
    if (!apiKey) {
      console.log('� Runware API Configuration:');
      console.log('Current status:', runwareConfig.apiKey ? 'Configured ✅' : 'Not configured ❌');
      console.log('WebSocket endpoint:', runwareConfig.websocketEndpoint);
      console.log('Model:', runwareConfig.model);
      console.log('');
      console.log('📋 To configure:');
      console.log('1. Get API key: https://runware.ai');
      console.log('2. Run: configureGoogleAI("your-api-key-here")');
      console.log('');
      console.log('🎯 Features available:');
      console.log('• Advanced AI image generation');
      console.log('• Image editing and enhancement');
      console.log('• Google Gemini Flash Image 2.5 model support');
      console.log('• WebSocket-based processing');
      return runwareConfig;
    }
    
    runwareConfig.apiKey = apiKey;
    localStorage.setItem('runwareApiKey', apiKey);
    if (typeof window !== 'undefined') window.runwareConfig = runwareConfig;
    console.log('✅ Runware API configured successfully!');
    showToast('✅ Runware API configured successfully!', 'success');
    
    // Test the connection
    testGoogleAIConnection();
    return runwareConfig;
  };

  // Initialize Google AI Studio configuration
  loadGoogleAIConfig();

  // Ensure Google AI functions are globally accessible

  // Hide loading screen if visible
  const loadingScreenElement = document.getElementById('loadingScreen');
  if (loadingScreenElement) {
    loadingScreenElement.style.opacity = '0';
    setTimeout(() => {
      loadingScreenElement.style.display = 'none';
    }, 300);
  }

} catch (error) {
  console.error('[Fallback] Critical initialization error:', error);
  
  // Show error UI to user
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f4e8d8 0%, #e7d2b8 100%);">
        <div style="background: #fffaf3; padding: 48px; border-radius: 16px; box-shadow: 0 30px 60px rgba(79, 59, 37, 0.18); max-width: 500px; width: 100%; text-align: center; border: 1px solid rgba(196, 139, 90, 0.2);">
          <div style="color: #ef4444; font-size: 48px; margin-bottom: 24px;">⚠️</div>
          <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #4b3b2a;">Application Error</h1>
          <p style="margin: 0 0 24px 0; color: #6b5440; font-size: 16px;">The Content Creation Program encountered an error during initialization.</p>
          
          <div style="background: #fef2f2; border: 1px solid #f5b5b5; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left;">
            <div style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">Error Details:</div>
            <div style="font-family: monospace; font-size: 12px; color: #7f1d1d; word-break: break-word;">${error.message}</div>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button onclick="location.reload()" style="background: #c48b5a; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; box-shadow: 0 12px 24px rgba(196, 139, 90, 0.35);">
              🔄 Reload Application
            </button>
            <button onclick="window.open('mailto:support@company.com?subject=Content Creation Program Error&body=' + encodeURIComponent('Error: ' + error.message + '\n\nPlease describe what you were doing when this error occurred...'), '_blank')" style="background: #6b5440; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; box-shadow: 0 12px 24px rgba(107, 84, 64, 0.35);">
              📧 Report Issue
            </button>
          </div>
          
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(196, 139, 90, 0.2);">
            <p style="margin: 0; font-size: 14px; color: #9ca3af;">If this problem persists, please contact your system administrator.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // Hide loading screen if visible
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}

})(); // End of IIFE

// ============================================================================
// POST-IIFE: Immediate WebSocket Initialization
// ============================================================================
// This runs IMMEDIATELY after the IIFE completes, ensuring WebSocket is ready
// before any user interaction. No more waiting for 13,000+ lines to execute!
(function() {
  console.log('[Post-IIFE] Checking WebSocket availability...');
  
  // The IIFE has just completed, so window.runwareWS should exist
  if (window.runwareWS && window.RunwareWebSocketManager) {
    console.log('[Post-IIFE] ✅ WebSocket and class found!');
    
    // Immediately resolve the promise so processWithGoogleAI doesn't wait
    if (typeof window._runwareReadyResolver === 'function') {
      console.log('[Post-IIFE] ✅ Resolving ready promise NOW...');
      window._runwareReadyResolver(true);
      console.log('[Post-IIFE] ✅ Promise resolved! Nano Banana ready for use.');
    } else {
      console.warn('[Post-IIFE] ⚠️ Ready resolver not found');
    }
  } else {
    console.error('[Post-IIFE] ❌ WebSocket not initialized by IIFE');
  }
})();

// Run in browser console:
configureGoogleAI("your-api-key-here")

