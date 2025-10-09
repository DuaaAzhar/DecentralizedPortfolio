import React, { useEffect, useState } from 'react';

const SurgicalFixer = () => {
  const [blockingElement, setBlockingElement] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const performClickTest = (x, y, label) => {
    // Get the element at these coordinates
    const elementAtPoint = document.elementFromPoint(x, y);
    
    // Check if we can reach interactive elements behind it
    const interactiveElements = document.querySelectorAll('button, a[href], input, [role="button"]');
    let blockedElements = 0;
    
    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom) {
        const topElement = document.elementFromPoint(
          rect.left + rect.width/2, 
          rect.top + rect.height/2
        );
        if (topElement !== el && !el.contains(topElement)) {
          blockedElements++;
        }
      }
    });

    return {
      label,
      x, y,
      elementAtPoint,
      tagName: elementAtPoint?.tagName || 'null',
      className: elementAtPoint?.className || '',
      id: elementAtPoint?.id || '',
      blockedElements,
      styles: elementAtPoint ? {
        position: getComputedStyle(elementAtPoint).position,
        zIndex: getComputedStyle(elementAtPoint).zIndex,
        pointerEvents: getComputedStyle(elementAtPoint).pointerEvents,
        opacity: getComputedStyle(elementAtPoint).opacity,
      } : {}
    };
  };

  const scanForBlockingElement = () => {
    setIsScanning(true);
    
    // Test multiple points across the screen
    const tests = [
      performClickTest(window.innerWidth/2, window.innerHeight/2, 'Center'),
      performClickTest(window.innerWidth/4, window.innerHeight/4, 'Top Left Quarter'),
      performClickTest(3*window.innerWidth/4, window.innerHeight/4, 'Top Right Quarter'),
      performClickTest(window.innerWidth/2, 3*window.innerHeight/4, 'Bottom Center'),
      performClickTest(200, 300, 'Projects Area (Estimated)'),
    ];

    setTestResults(tests);

    // Find the most common blocking element
    const elementCounts = {};
    tests.forEach(test => {
      const key = `${test.tagName}-${test.className}-${test.id}`;
      if (!elementCounts[key]) {
        elementCounts[key] = { count: 0, element: test.elementAtPoint, info: test };
      }
      elementCounts[key].count++;
    });

    // Find the element that appears most often and blocks the most
    let mostProblematic = null;
    let maxScore = 0;

    Object.values(elementCounts).forEach(item => {
      const score = item.count * (item.info.blockedElements + 1);
      if (score > maxScore && item.element && item.element !== document.body && item.element !== document.documentElement) {
        maxScore = score;
        mostProblematic = item;
      }
    });

    setBlockingElement(mostProblematic);
    setIsScanning(false);
  };

  const fixBlockingElement = () => {
    if (!blockingElement?.element) return;

    const element = blockingElement.element;
    
    // Apply the most effective fix
    element.style.pointerEvents = 'none';
    element.style.zIndex = '1';
    
    // Enable all interactive children
    const interactiveChildren = element.querySelectorAll(
      'button, a[href], input, select, textarea, [role="button"], [onclick], [tabindex]:not([tabindex="-1"])'
    );
    
    interactiveChildren.forEach(child => {
      child.style.pointerEvents = 'auto';
      child.style.zIndex = '9999';
      child.style.position = 'relative';
    });

    // Also enable any glass-container or card elements
    const containers = element.querySelectorAll('.glass-container, .glass-card, [class*="card"]');
    containers.forEach(container => {
      container.style.pointerEvents = 'auto';
      container.style.zIndex = '100';
    });

    console.log('Fixed blocking element:', element);
    
    // Re-scan to verify fix
    setTimeout(() => {
      scanForBlockingElement();
    }, 500);
  };

  const removeBlockingElement = () => {
    if (!blockingElement?.element) return;
    
    blockingElement.element.style.display = 'none';
    console.log('Hidden blocking element:', blockingElement.element);
    
    // Re-scan
    setTimeout(() => {
      scanForBlockingElement();
    }, 500);
  };

  const highlightBlockingElement = () => {
    if (!blockingElement?.element) return;

    // Clear previous highlights
    document.querySelectorAll('.surgical-highlight').forEach(el => {
      el.classList.remove('surgical-highlight');
      el.style.outline = '';
      el.style.backgroundColor = '';
    });

    const element = blockingElement.element;
    element.classList.add('surgical-highlight');
    element.style.outline = '3px solid red';
    element.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const applyGlobalFix = () => {
    // Find all elements that are covering significant screen area
    const allElements = document.querySelectorAll('*');
    const problematicElements = [];

    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const styles = getComputedStyle(el);
      
      // Check if element covers significant area and might be blocking
      if (rect.width > window.innerWidth * 0.7 && 
          rect.height > window.innerHeight * 0.7 && 
          (styles.position === 'fixed' || styles.position === 'absolute') &&
          el !== document.body && 
          el !== document.documentElement) {
        problematicElements.push(el);
      }
    });

    // Fix all problematic elements
    problematicElements.forEach(el => {
      el.style.pointerEvents = 'none';
      el.style.zIndex = '1';
      
      // Enable interactive children
      const interactiveChildren = el.querySelectorAll(
        'button, a[href], input, select, textarea, [role="button"], [onclick]'
      );
      
      interactiveChildren.forEach(child => {
        child.style.pointerEvents = 'auto';
        child.style.zIndex = '9999';
        child.style.position = 'relative';
      });
    });

    console.log(`Applied global fix to ${problematicElements.length} elements`);
    alert(`Fixed ${problematicElements.length} potentially blocking elements. Test your page now!`);
  };

  useEffect(() => {
    scanForBlockingElement();
  }, []);

  return (
    <div 
      className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg shadow-xl max-w-sm border-2 border-blue-500"
      style={{ zIndex: 99999 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-blue-400 text-sm">🎯 SURGICAL FIXER</h3>
        <button
          onClick={scanForBlockingElement}
          disabled={isScanning}
          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Re-scan'}
        </button>
      </div>

      <div className="space-y-3 text-xs">
        {/* Test Results Summary */}
        <div className="bg-gray-800 p-2 rounded">
          <h4 className="font-semibold text-gray-300 mb-1">Click Test Results:</h4>
          {testResults.map((test, i) => (
            <div key={i} className="text-gray-400">
              {test.label}: <span className={test.blockedElements > 0 ? 'text-red-400' : 'text-green-400'}>
                {test.blockedElements} blocked
              </span>
            </div>
          ))}
        </div>

        {/* Primary Blocking Element */}
        {blockingElement ? (
          <div className="bg-red-900 p-2 rounded">
            <h4 className="font-semibold text-red-300 mb-1">🚨 Primary Blocker:</h4>
            <div className="text-red-200 space-y-1">
              <div><strong>Tag:</strong> {blockingElement.info.tagName}</div>
              {blockingElement.info.className && (
                <div><strong>Class:</strong> {blockingElement.info.className.split(' ')[0]}...</div>
              )}
              {blockingElement.info.id && (
                <div><strong>ID:</strong> {blockingElement.info.id}</div>
              )}
              <div><strong>Position:</strong> {blockingElement.info.styles.position}</div>
              <div><strong>Z-Index:</strong> {blockingElement.info.styles.zIndex}</div>
            </div>

            <div className="flex gap-1 mt-2">
              <button
                onClick={highlightBlockingElement}
                className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700"
              >
                Show
              </button>
              <button
                onClick={fixBlockingElement}
                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
              >
                Fix
              </button>
              <button
                onClick={removeBlockingElement}
                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
              >
                Hide
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-800 p-2 rounded">
            <p className="text-green-300">No obvious blocking element detected!</p>
          </div>
        )}

        {/* Global Fix Button */}
        <button
          onClick={applyGlobalFix}
          className="w-full bg-purple-600 text-white px-3 py-2 rounded text-xs hover:bg-purple-700 font-semibold"
        >
          🛠️ APPLY GLOBAL FIX
        </button>

        <div className="text-xs text-gray-400 pt-2 border-t border-gray-600">
          This tool identifies the exact element blocking clicks across your page.
        </div>
      </div>
    </div>
  );
};

export default SurgicalFixer;