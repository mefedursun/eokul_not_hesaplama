const derslerKey = "eokul_dersler";
let dersler = JSON.parse(localStorage.getItem(derslerKey)) || [];

function hesaplaOrtalama(ders) {
    let notlar = [];
    if (typeof ders.sinav1 === "number" && !isNaN(ders.sinav1)) notlar.push(ders.sinav1);
    if (typeof ders.sinav2 === "number" && !isNaN(ders.sinav2)) notlar.push(ders.sinav2);
    if (typeof ders.perf1 === "number" && !isNaN(ders.perf1)) notlar.push(ders.perf1);
    if (typeof ders.perf2 === "number" && !isNaN(ders.perf2)) notlar.push(ders.perf2);
    if (typeof ders.proje === "number" && !isNaN(ders.proje)) notlar.push(ders.proje);
    return notlar.length ? (notlar.reduce((a, b) => a + b, 0) / notlar.length).toFixed(2) : 0;
}

function enYuksek(notlar) {
    return notlar.length ? Math.max(...notlar) : "-";
}

function enDusuk(notlar) {
    return notlar.length ? Math.min(...notlar) : "-";
}

function tabloyuGuncelle() {
    const tbody = document.querySelector("#dersTablosu tbody");
    tbody.innerHTML = "";
    dersler.forEach((ders, i) => {
        let tumNotlar = [];
        if (typeof ders.sinav1 === "number" && !isNaN(ders.sinav1)) tumNotlar.push(ders.sinav1);
        if (typeof ders.sinav2 === "number" && !isNaN(ders.sinav2)) tumNotlar.push(ders.sinav2);
        if (typeof ders.perf1 === "number" && !isNaN(ders.perf1)) tumNotlar.push(ders.perf1);
        if (typeof ders.perf2 === "number" && !isNaN(ders.perf2)) tumNotlar.push(ders.perf2);
        if (typeof ders.proje === "number" && !isNaN(ders.proje)) tumNotlar.push(ders.proje);
        const ort = hesaplaOrtalama(ders);
        const ortBadge = ort >= 50 ? "bg-primary" : "bg-danger";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${ders.ad}</td>
            <td>${ders.saat}</td>
            <td>${typeof ders.sinav1 === "number" && !isNaN(ders.sinav1) ? ders.sinav1 : "-"}</td>
            <td>${typeof ders.sinav2 === "number" && !isNaN(ders.sinav2) ? ders.sinav2 : "-"}</td>
            <td>${typeof ders.perf1 === "number" && !isNaN(ders.perf1) ? ders.perf1 : "-"} ${typeof ders.perf2 === "number" && !isNaN(ders.perf2) ? ", " + ders.perf2 : ""}</td>
            <td>${typeof ders.proje === "number" && !isNaN(ders.proje) ? ders.proje : "-"}</td>
            <td><span class="badge ${ortBadge} fs-6">${ort}</span></td>
            <td>${enYuksek(tumNotlar)}</td>
            <td>${enDusuk(tumNotlar)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="dersSil(${i})">Sil</button></td>
        `;
        tbody.appendChild(tr);
    });
    localStorage.setItem(derslerKey, JSON.stringify(dersler));
    istatistikleriGoster();
}

function istatistikleriGoster() {
    if (!dersler.length) {
        document.getElementById("istatistikler").innerHTML = "";
        return;
    }
    let tumNotlar = [];
    let gecemeyenDersler = [];
    dersler.forEach(d => {
        let dersNotlari = [];
        if (typeof d.sinav1 === "number" && !isNaN(d.sinav1)) dersNotlari.push(d.sinav1);
        if (typeof d.sinav2 === "number" && !isNaN(d.sinav2)) dersNotlari.push(d.sinav2);
        if (typeof d.perf1 === "number" && !isNaN(d.perf1)) dersNotlari.push(d.perf1);
        if (typeof d.perf2 === "number" && !isNaN(d.perf2)) dersNotlari.push(d.perf2);
        if (typeof d.proje === "number" && !isNaN(d.proje)) dersNotlari.push(d.proje);
        tumNotlar.push(...dersNotlari);
        const ort = parseFloat(hesaplaOrtalama(d));
        if (ort < 50) {
            gecemeyenDersler.push(`${d.ad} (${ort})`);
        }
    });
    const genelOrt = tumNotlar.length ? (tumNotlar.reduce((a, b) => a + b, 0) / tumNotlar.length).toFixed(2) : "-";
    const yuksek = enYuksek(tumNotlar);
    const dusuk = enDusuk(tumNotlar);

    let belge = "";
    if (genelOrt >= 85 && gecemeyenDersler.length === 0) {
        belge = `<span class="badge bg-success fs-6">Takdir Belgesi</span>`;
    } else if (genelOrt >= 70 && gecemeyenDersler.length === 0) {
        belge = `<span class="badge bg-info text-dark fs-6">Teşekkür Belgesi</span>`;
    } else {
        belge = `<span class="badge bg-danger fs-6">Belge Yok</span>`;
    }

    let gecemeyenHtml = "";
    if (gecemeyenDersler.length) {
        gecemeyenHtml = `<div class="mt-2 alert alert-danger p-2">
            <b>Geçilemeyen Dersler:</b> ${gecemeyenDersler.join(", ")}
        </div>`;
    }

    document.getElementById("istatistikler").innerHTML = `
        <div class="alert alert-info mb-0">
            <strong>Genel Ortalama:</strong> <span class="badge bg-success">${genelOrt}</span>
            &nbsp; <strong>En Yüksek Not:</strong> <span class="badge bg-warning text-dark">${yuksek}</span>
            &nbsp; <strong>En Düşük Not:</strong> <span class="badge bg-danger">${dusuk}</span>
            &nbsp; <strong>Belge:</strong> ${belge}
            ${gecemeyenHtml}
        </div>
    `;
}

window.dersSil = function(i) {
    dersler.splice(i, 1);
    tabloyuGuncelle();
};

document.getElementById('notForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const ad = document.getElementById('ders').value.trim();
    const sinav1Raw = document.getElementById('sinav1').value;
    const sinav2Raw = document.getElementById('sinav2').value;
    const perf1Raw = document.getElementById('perf1').value;
    const perf2Raw = document.getElementById('perf2').value;
    const projeRaw = document.getElementById('proje').value;
    const saatRaw = document.getElementById('saat').value;

    const sinav1 = Number(sinav1Raw);
    const sinav2 = Number(sinav2Raw);
    const perf1 = perf1Raw !== "" ? Number(perf1Raw) : null;
    const perf2 = perf2Raw !== "" ? Number(perf2Raw) : null;
    const saat = Number(saatRaw);
    let proje = null;
    if (projeRaw && !isNaN(Number(projeRaw)) && Number(projeRaw) >= 0 && Number(projeRaw) <= 100) {
        proje = Number(projeRaw);
    }

    if (!ad) {
        alert("Ders adı giriniz.");
        return;
    }
    if (isNaN(sinav1) || sinav1 < 0 || sinav1 > 100) {
        alert("1. Sınav notu 0-100 arası olmalı.");
        return;
    }
    if (isNaN(sinav2) || sinav2 < 0 || sinav2 > 100) {
        alert("2. Sınav notu 0-100 arası olmalı.");
        return;
    }
    if (perf1Raw && (isNaN(perf1) || perf1 < 0 || perf1 > 100)) {
        alert("1. Performans notu 0-100 arası olmalı.");
        return;
    }
    if (perf2Raw && (isNaN(perf2) || perf2 < 0 || perf2 > 100)) {
        alert("2. Performans notu 0-100 arası olmalı.");
        return;
    }
    if (projeRaw && (isNaN(Number(projeRaw)) || Number(projeRaw) < 0 || Number(projeRaw) > 100)) {
        alert("Proje notu 0-100 arası olmalı.");
        return;
    }
    if (!saat || saat < 1) {
        alert("Ders saati 1 veya daha büyük bir sayı olmalı.");
        return;
    }
    dersler.push({ ad, sinav1, sinav2, perf1, perf2, proje, saat });
    this.reset();
    tabloyuGuncelle();
});

tabloyuGuncelle();