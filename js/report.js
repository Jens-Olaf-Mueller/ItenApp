const FRM_SITE = $('frmSiteReport'),
      FRM_EXAM = $('frmCM'),
      FRM_REGIE = $('frmRegie'),
      FRM_WEEKLY = $('frmWeeklyReport');

const clsWizard = new Wizard(FRM_EXAM, href);

function initReports(report) {
    switch (report) {
        case 'weekly':
            $('.title').innerHTML = 'Wochenrapport';
            FRM_WEEKLY.classList.remove('hidden');
            $('inpWeekFromDate').value = getCurrentDate();
            $('inpWeekUntilDate').value = getCurrentDate();
            $('legendKW').innerText = '  Kalenderwoche ' + getKW();
            break;
        case 'ordered':
            FRM_REGIE.classList.remove('hidden');
            $('.title').innerHTML = 'Regierapport';
            $('inpRegieDate').value = getCurrentDate();
            break;
        case 'site':
            $('.title').innerHTML = 'Baustellenrapport';
            FRM_SITE.classList.remove('hidden');
            $('inpReportUntilDate').value = getCurrentDate();
            break;
        case 'exam':
            FRM_EXAM.classList.remove('hidden');
            clsWizard.add($('.title'), 'CM-Messung');
            clsWizard.showCamButton = true;
            clsWizard.showInfoButton = true;
            $('inpExaminationDate').value = getCurrentDate();
            break;
        default: return;
    }
}