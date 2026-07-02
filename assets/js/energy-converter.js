(function () {
  var LIGHT_SPEED = 299792458;
  var E_VOLT = 1.602176634e-19;
  var PLANK = 6.62607015e-34;
  var CONST_CONVERT = PLANK * LIGHT_SPEED / E_VOLT * 1e9;

  function byId(id) {
    return document.getElementById(id);
  }

  function valueOf(id) {
    var element = byId(id);
    return element ? parseFloat(element.value) : NaN;
  }

  function setValue(id, value, decimals) {
    var element = byId(id);
    if (element && isFinite(value)) {
      element.value = value.toFixed(decimals);
    }
  }

  function getRamanWavenumber(lambda0, lambda1) {
    return (1.0 / lambda0 - 1.0 / lambda1) * Math.pow(10, 7);
  }

  function getRamanWavelength(lambda0, deltaw) {
    return 1.0 / (1.0 / lambda0 - deltaw * Math.pow(10, -7));
  }

  function getRamanFrequency(lambda0, lambda1) {
    return LIGHT_SPEED * (lambda1 - lambda0) / (lambda0 * lambda1);
  }

  function getRmev(lambda0, lambda1) {
    return CONST_CONVERT * 1000.0 * (1.0 / lambda0 - 1.0 / lambda1);
  }

  function unitConversion(source, valNum) {
    valNum = parseFloat(valNum);
    if (!isFinite(valNum) || valNum === 0) {
      return;
    }

    var inputCm = byId("input_cm");
    var inputNm = byId("input_nm");
    var inputUm = byId("input_um");
    var inputMev = byId("input_meV");
    var inputJ = byId("input_J");

    if (!inputCm || !inputNm || !inputUm || !inputMev || !inputJ) {
      return;
    }

    if (source === "input_cm") {
      inputNm.value = (10000000 / valNum).toFixed(2);
      inputUm.value = (10000 / valNum).toFixed(2);
      inputMev.value = (valNum * 0.123984193).toFixed(2);
      inputJ.value = (valNum * 0.123984193 / 1000000 * 1.60217646e-19).toExponential(2);
    }
    if (source === "input_nm") {
      inputCm.value = (10000000 / valNum).toFixed(2);
      inputUm.value = (valNum * 0.001).toFixed(2);
      inputMev.value = (1239841.93 / valNum).toFixed(2);
      inputJ.value = (1239841.93 / valNum / 1000000 * 1.60217646e-19).toExponential(2);
    }
    if (source === "input_um") {
      inputCm.value = (10000 / valNum).toFixed(2);
      inputNm.value = (valNum * 1000).toFixed(2);
      inputMev.value = (1239.84193 / valNum).toFixed(2);
      inputJ.value = (1239.84193 / valNum / 1000000 * 1.60217646e-19).toExponential(2);
    }
    if (source === "input_meV") {
      inputCm.value = (valNum * 8.065544290795).toFixed(2);
      inputNm.value = (1239841.93 / valNum).toFixed(2);
      inputUm.value = (1239.84193 / valNum).toFixed(2);
      inputJ.value = ((valNum / 1000000) * 1.60217646e-19).toExponential(2);
    }
    if (source === "input_J") {
      inputMev.value = (valNum / 1.60217646e-19 * 1000000).toFixed(2);
      inputCm.value = (valNum / 1.60217646e-19 * 1000000 * 8.065544290795).toFixed(2);
      inputNm.value = (1239841.93 / valNum / 1.60217646e-19 * 1000000).toFixed(2);
      inputUm.value = (1239.84193 / valNum / 1.60217646e-19 * 1000000).toFixed(2);
    }
  }

  function updateRamanFromWavelength() {
    var l0 = valueOf("l0");
    var l1 = valueOf("l1");
    if (!isFinite(l0) || !isFinite(l1) || l0 === 0 || l1 === 0) {
      return;
    }

    setValue("dw", getRamanWavenumber(l0, l1), 2);
    setValue("rghz", getRamanFrequency(l0, l1), 2);
    setValue("rmev", getRmev(l0, l1), 2);
  }

  function updateRamanFromWavenumber() {
    var dw = valueOf("dw");
    var l0 = valueOf("l0");
    if (!isFinite(dw) || !isFinite(l0) || l0 === 0) {
      return;
    }

    setValue("l1", getRamanWavelength(l0, dw), 2);
    updateRamanFromWavelength();
  }

  function bindEnergyInputs() {
    ["input_nm", "input_um", "input_cm", "input_meV", "input_J"].forEach(function (id) {
      var element = byId(id);
      if (!element) {
        return;
      }
      ["input", "change"].forEach(function (eventName) {
        element.addEventListener(eventName, function () {
          unitConversion(id, element.value);
        });
      });
    });
  }

  function bindRamanInputs() {
    var l0 = byId("l0");
    var l1 = byId("l1");
    var dw = byId("dw");

    if (l1) {
      l1.addEventListener("input", updateRamanFromWavelength);
    }
    if (l0) {
      l0.addEventListener("input", function () {
        if (l1 && l1.value !== "") {
          updateRamanFromWavelength();
        }
      });
    }
    if (dw) {
      dw.addEventListener("input", updateRamanFromWavenumber);
    }
  }

  function initEnergyConverter() {
    bindEnergyInputs();
    bindRamanInputs();
  }

  window.unitConversion = unitConversion;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEnergyConverter);
  } else {
    initEnergyConverter();
  }
})();
