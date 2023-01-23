const FRM_MATERIAL = $('frmMaterial'),
      FRM_MEASURE = $('frmMeasure');

function initTools(tool) {
    switch (tool) {
        case 'material': 
            FRM_MATERIAL.classList.remove('hidden');
            initMaterialCalcuator('Materialrechner');        
            break;
        case 'measure': 
            FRM_MEASURE.classList.remove('hidden');
            initPageMeasure('Ausmass');        
            break;
        default: return;
    }
}