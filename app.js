const BIFACIAL_MATRIX = {
    4: { kw: 2.18, adani: 124540, waaree: 122740, aps: 116140 },
    5: { kw: 2.725, adani: 146175, waaree: 145050, aps: 136800 },
    6: { kw: 3.27, adani: 171310, waaree: 167460, aps: 157560 },
    7: { kw: 3.815, adani: 184945, waaree: 180570, aps: 169020 },
    8: { kw: 4.36, adani: 208840, waaree: 202880, aps: 189680 },
    9: { kw: 4.905, adani: 249715, waaree: 243240, aps: 228390 },
    10: { kw: 5.45, adani: 267910, waaree: 260700, aps: 244200 },
    11: { kw: 5.995, adani: 298985, waaree: 291110, aps: 272960 },
    12: { kw: 6.54, adani: 324620, waaree: 315720, aps: 295920 }
};

const TOPCON_MATRIX = {
    4: { adaniKw: 2.48, adaniRate: 124300, waareeKw: 2.32, waareeRate: 125640, apsKw: 2.32, apsRate: 118440 },
    5: { adaniKw: 3.10, adaniRate: 151500, waareeKw: 2.90, waareeRate: 148400, apsKw: 2.90, apsRate: 139400 },
    6: { adaniKw: 3.72, adaniRate: 172700, waareeKw: 3.48, waareeRate: 172360, apsKw: 3.48, apsRate: 161560 },
    7: { adaniKw: 4.34, adaniRate: 192400, waareeKw: 4.06, waareeRate: 198120, apsKw: 4.06, apsRate: 185520 },
    8: { adaniKw: 4.96, adaniRate: 210600, waareeKw: 4.64, waareeRate: 219280, apsKw: 4.64, apsRate: 204880 },
    9: { adaniKw: 5.40, adaniRate: 236800, waareeKw: 5.22, waareeRate: 249940, apsKw: 5.22, apsRate: 233740 },
    10: { adaniKw: 6.20, adaniRate: 262600, waareeKw: 5.80, waareeRate: 265100, apsKw: 5.80, apsRate: 247100 }
};

const STRUCTURE_BOM_MAP = {
    4: { p40: 2, p60: 3 }, 5: { p40: 3, p60: 3 }, 6: { p40: 3, p60: 4 }, 
    7: { p40: 3, p60: 4 }, 8: { p40: 4, p60: 4 }, 9: { p40: 4, p60: 5 }, 10: { p40: 4, p60: 5 }
};

function updatePanelsDropdown() {
    const tech = document.getElementById('techType').value;
    const panelsSelect = document.getElementById('panels');
    panelsSelect.innerHTML = '';
    
    const limit = tech === 'BIFACIAL' ? 12 : 10;
    for (let i = 4; i <= limit; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Nos Panels Array`;
        panelsSelect.appendChild(option);
    }
}

function toggleLoanInput() {
    const isChecked = document.getElementById('loanClause').checked;
    document.getElementById('loanAmountContainer').classList.toggle('hidden', !isChecked);
}

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'ratneswar2026') {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
        updatePanelsDropdown();
    } else {
        alert('Access Denied: Invalid Security Identification Details.');
    }
}

function handleLogout() {
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function processCalculations() {
    const tech = document.getElementById('techType').value;
    const panels = parseInt(document.getElementById('panels').value);
    const brand = document.getElementById('brandSelection').value;
    const loanApplied = document.getElementById('loanClause').checked;
    const loanAmount = parseFloat(document.getElementById('loanInputAmount').value) || 0;

    let basePrice = 0;
    let computedKw = 0;

    if (tech === 'BIFACIAL') {
        const row = BIFACIAL_MATRIX[panels];
        if (row) {
            computedKw = row.kw;
            basePrice = row[brand];
        }
    } else {
        const row = TOPCON_MATRIX[panels];
        if (row) {
            if (brand === 'adani') { computedKw = row.adaniKw; basePrice = row.adaniRate; }
            else if (brand === 'waaree') { computedKw = row.waareeKw; basePrice = row.waareeRate; }
            else { computedKw = row.apsKw; basePrice = row.apsRate; }
        }
    }

    const structuralLoanTax = loanApplied ? Math.round(loanAmount * 0.089) : 0;
    const netTotal = basePrice + structuralLoanTax;
    const structuralPipes = STRUCTURE_BOM_MAP[panels] || { p40: 5, p60: 6 };

    document.getElementById('outKw').textContent = `${computedKw} kW`;
    document.getElementById('outBrand').textContent = `${tech} / ${brand.toUpperCase()}`;
    document.getElementById('outBasePrice').textContent = `₹${basePrice.toLocaleString('en-IN')}.00`;

    if (structuralLoanTax > 0) {
        document.getElementById('loanTaxRow').classList.remove('hidden');
        document.getElementById('outLoanTax').textContent = `₹${structuralLoanTax.toLocaleString('en-IN')}.00`;
    } else {
        document.getElementById('loanTaxRow').classList.add('hidden');
    }

    document.getElementById('outNetTotal').textContent = `₹${netTotal.toLocaleString('en-IN')}.00`;
    document.getElementById('outP40').textContent = `${structuralPipes.p40} Pcs`;
    document.getElementById('outP60').textContent = `${structuralPipes.p60} Pcs`;

    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('print-area').classList.remove('hidden');
}
