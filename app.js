const roleConfig = {
  director: {
    name: 'Administrator / Director',
    weight: 1,
    functions: [
      { name: 'Strategie', score: 95 },
      { name: 'Planificare', score: 90 },
      { name: 'Analiză KPI', score: 92 },
      { name: 'Control profit', score: 94 }
    ]
  },
  sales_manager: {
    name: 'Manager vânzări',
    weight: 1.1,
    functions: [
      { name: 'Target echipă', score: 90 },
      { name: 'Plan activități', score: 88 },
      { name: 'Monitorizare conversie', score: 91 },
      { name: 'Follow-up', score: 87 }
    ]
  },
  b2b_manager: {
    name: 'Manager B2B',
    weight: 1.08,
    functions: [
      { name: 'Prospectare B2B', score: 89 },
      { name: 'Negociere', score: 92 },
      { name: 'Contracte', score: 86 },
      { name: 'Relații clienți', score: 90 }
    ]
  },
  sales_agent: {
    name: 'Agent vânzări',
    weight: 1,
    functions: [
      { name: 'Apeluri', score: 88 },
      { name: 'Contacte', score: 85 },
      { name: 'Oferte', score: 90 },
      { name: 'Închidere', score: 82 }
    ]
  },
  backoffice: {
    name: 'Back-office / CRM',
    weight: 0.9,
    functions: [
      { name: 'Introducere date', score: 95 },
      { name: 'Validare comenzi', score: 90 },
      { name: 'Documente', score: 92 },
      { name: 'Flux CRM', score: 94 }
    ]
  },
  logistics: {
    name: 'Logistică / Livrare',
    weight: 0.8,
    functions: [
      { name: 'Picking', score: 89 },
      { name: 'Ambalare', score: 86 },
      { name: 'Transport', score: 88 },
      { name: 'Confirmare primire', score: 91 }
    ]
  },
  finance: {
    name: 'Financiar / Contabilitate',
    weight: 0.9,
    functions: [
      { name: 'Facturare', score: 94 },
      { name: 'Încasare', score: 89 },
      { name: 'Crențe', score: 87 },
      { name: 'Cash-flow', score: 90 }
    ]
  },
  service: {
    name: 'Customer Service',
    weight: 0.85,
    functions: [
      { name: 'Retururi', score: 86 },
      { name: 'Reclamații', score: 88 },
      { name: 'Garanții', score: 89 },
      { name: 'Păstrarea clientului', score: 91 }
    ]
  }
};

const sections = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');

sections.forEach((button) => {
  button.addEventListener('click', () => {
    sections.forEach((btn) => btn.classList.remove('active'));
    panels.forEach((panel) => panel.classList.remove('active'));
    button.classList.add('active');
    const target = document.getElementById(button.dataset.section);
    if (target) target.classList.add('active');
  });
});

const formatMoney = (value) =>
  new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(value);

function getNumeric(id) {
  const value = Number(document.getElementById(id)?.value ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function calculateRolePerformance(roleKey) {
  const role = roleConfig[roleKey];
  const avg =
    role.functions.reduce((sum, item) => sum + item.score, 0) / role.functions.length;
  return Math.min(100, Math.max(0, avg * role.weight));
}

function renderFunctionList(roleKey) {
  const list = document.getElementById('functionList');
  if (!list) return;

  const role = roleConfig[roleKey];
  list.innerHTML = role.functions
    .map(
      (item) => `
        <li>
          <span>${item.name}</span>
          <strong>${item.score}%</strong>
        </li>
      `
    )
    .join('');
}

function calculateCRM() {
  const dealTotal = getNumeric('dealTotal');
  const probability = getNumeric('probability') / 100;
  const totalCosts = getNumeric('totalCosts');
  const grossProfit = getNumeric('grossProfit');
  const monthlyTarget = getNumeric('monthlyTarget');
  const teamSize = Math.max(1, getNumeric('teamSize'));
  const commissionRate = getNumeric('commissionRate') / 100;
  const newCustomers = getNumeric('newCustomers');
  const existingCustomers = getNumeric('existingCustomers');
  const churnRate = getNumeric('churnRate') / 100;
  const retentionRate = getNumeric('retentionRate') / 100;
  const cac = getNumeric('cac');
  const ltv = getNumeric('ltv');
  const avgOrderValue = getNumeric('avgOrderValue');
  const purchaseFrequency = getNumeric('purchaseFrequency');

  const pipelineValue = dealTotal * probability;
  const forecastValue = pipelineValue + grossProfit * 0.18;
  const commissionValue = pipelineValue * commissionRate;
  const targetPerAgent = monthlyTarget / teamSize;

  const conversionRate =
    ((newCustomers / Math.max(newCustomers + existingCustomers, 1)) * 100);
  const roi = totalCosts > 0 ? ((grossProfit - totalCosts) / totalCosts) * 100 : 0;
  const netProfit = grossProfit - totalCosts - commissionValue;
  const cashFlow = grossProfit - totalCosts;
  const receivables = Math.max(0, pipelineValue * 0.22);

  const ltvCac = cac > 0 ? ltv / cac : 0;
  const customerValue = avgOrderValue * purchaseFrequency * 12;
  const roleKey = document.getElementById('roleSelect').value;
  const rolePerformance = calculateRolePerformance(roleKey);

  const leadScore = Math.min(
    100,
    Math.round((probability * 100 + (ltv / Math.max(cac, 1)) * 12 + conversionRate) / 3)
  );

  document.getElementById('revenueMetric').textContent = formatMoney(pipelineValue);
  document.getElementById('profitMetric').textContent = formatMoney(netProfit);
  document.getElementById('marginMetric').textContent = `${((netProfit / Math.max(pipelineValue, 1)) * 100).toFixed(1)}%`;
  document.getElementById('conversionMetric').textContent = `${conversionRate.toFixed(1)}%`;

  document.getElementById('pipelineValue').textContent = formatMoney(pipelineValue);
  document.getElementById('forecastValue').textContent = formatMoney(forecastValue);
  document.getElementById('commissionValue').textContent = formatMoney(commissionValue);
  document.getElementById('targetPerAgent').textContent = formatMoney(targetPerAgent);

  document.getElementById('leadScoreValue').textContent = `${leadScore}`;
  document.getElementById('conversionValue').textContent = `${conversionRate.toFixed(1)}%`;
  document.getElementById('roiValue').textContent = `${roi.toFixed(1)}%`;
  document.getElementById('rolePerformance').textContent = `${rolePerformance.toFixed(1)}%`;

  document.getElementById('cashFlowValue').textContent = formatMoney(cashFlow);
  document.getElementById('ltvCacValue').textContent = ltvCac.toFixed(2);
  document.getElementById('netProfitValue').textContent = formatMoney(netProfit);
  document.getElementById('receivablesValue').textContent = formatMoney(receivables);

  document.getElementById('retentionValue').textContent = `${(retentionRate * 100).toFixed(1)}%`;
  document.getElementById('churnValue').textContent = `${(churnRate * 100).toFixed(1)}%`;
  document.getElementById('ltvValue').textContent = formatMoney(ltv);
  document.getElementById('customerValueValue').textContent = formatMoney(customerValue);

  renderFunctionList(roleKey);
}

const fields = [
  'dealTotal', 'probability', 'totalCosts', 'grossProfit', 'monthlyTarget', 'teamSize',
  'commissionRate', 'newCustomers', 'existingCustomers', 'churnRate', 'retentionRate',
  'cac', 'ltv', 'avgOrderValue', 'purchaseFrequency'
];

fields.forEach((id) => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener('input', calculateCRM);
  }
});

document.getElementById('roleSelect').addEventListener('change', () => {
  calculateCRM();
});

renderFunctionList(document.getElementById('roleSelect').value);
calculateCRM();
