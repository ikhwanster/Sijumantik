import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  HomeInspectionRecord, 
  DengueCaseReport, 
  LogisticsItem, 
  CommunityReport, 
  AreaZone 
} from '../types/jumantik';

// Helper to format date
const getTodayDateStr = () => {
  const now = new Date();
  return now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * ====================================================================
 * 1. EXPORT PEMANTAUAN JENTIK 1R1J (KARTU PANTAU WARGA)
 * ====================================================================
 */

export const exportInspectionsToPdf = (inspections: HomeInspectionRecord[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const cleanCount = inspections.filter((i) => i.status === 'bebas_jentik').length;
  const abjRate = inspections.length > 0 ? Math.round((cleanCount / inspections.length) * 100) : 100;

  // Header Banner
  doc.setFillColor(16, 149, 107); // Emerald color
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SIJUMANTIK - LAPORAN REKAPITULASI PEMANTAUAN JENTIK (1R1J)', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Kementerian Kesehatan RI • Gerakan Satu Rumah Satu Jumantik • Dicetak: ${getTodayDateStr()}`, 14, 18);

  // Summary Stat Boxes
  doc.setTextColor(30, 41, 59);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 28, 60, 16, 2, 2, 'F');
  doc.roundedRect(80, 28, 60, 16, 2, 2, 'F');
  doc.roundedRect(146, 28, 60, 16, 2, 2, 'F');
  doc.roundedRect(212, 28, 71, 16, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Rumah Dipantau', 18, 33);
  doc.text('Rumah Bebas Jentik', 84, 33);
  doc.text('Rumah Positif Jentik', 150, 33);
  doc.text('Angka Bebas Jentik (ABJ)', 216, 33);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${inspections.length} Rumah`, 18, 40);
  doc.setTextColor(16, 149, 107);
  doc.text(`${cleanCount} Rumah`, 84, 40);
  doc.setTextColor(220, 38, 38);
  doc.text(`${inspections.length - cleanCount} Rumah`, 150, 40);
  doc.setTextColor(abjRate >= 95 ? 16 : 220, abjRate >= 95 ? 149 : 38, abjRate >= 95 ? 107 : 38);
  doc.text(`${abjRate}% (Target ≥95%)`, 216, 40);

  // Data Table
  const tableData = inspections.map((item, idx) => [
    idx + 1,
    item.date,
    item.houseAddress,
    `RT ${item.rt} / RW ${item.rw}`,
    item.inspectorName,
    item.totalContainers,
    item.positiveContainers,
    item.status === 'bebas_jentik' ? 'BEBAS JENTIK' : 'POSITIF JENTIK',
    item.verifiedByKader ? 'Ya (Kader)' : 'Mandiri',
    item.notes || '-'
  ]);

  autoTable(doc, {
    startY: 48,
    head: [[
      'No',
      'Tanggal',
      'Alamat Rumah',
      'RT / RW',
      'Nama Jumantik',
      'Total Wadah',
      'Positif Jentik',
      'Status',
      'Verifikasi',
      'Catatan / Tindakan PSN'
    ]],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 22 },
      2: { cellWidth: 45 },
      3: { cellWidth: 20 },
      4: { cellWidth: 32 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 28, fontStyle: 'bold' },
      8: { cellWidth: 20 },
      9: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      if (data.column.index === 7 && data.section === 'body') {
        if (data.cell.raw === 'BEBAS JENTIK') {
          data.cell.styles.textColor = [16, 149, 107];
        } else {
          data.cell.styles.textColor = [220, 38, 38];
        }
      }
    }
  });

  // Footer Signatures
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 150;
  if (finalY < 185) {
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.text('Mengetahui, Ketua Satgas DBD RW', 20, finalY);
    doc.text('( .................................................. )', 20, finalY + 18);

    doc.text('Koordinator Program DBD Puskesmas', 210, finalY);
    doc.text('( .................................................. )', 210, finalY + 18);
  }

  doc.save(`SiJumantik_Rekap_1R1J_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportInspectionsToExcel = (inspections: HomeInspectionRecord[]) => {
  const data = inspections.map((item, idx) => ({
    'No': idx + 1,
    'Tanggal Pantau': item.date,
    'Alamat Rumah': item.houseAddress,
    'RT': item.rt,
    'RW': item.rw,
    'Kelurahan': item.kelurahan,
    'Nama Jumantik / Warga': item.inspectorName,
    'Total Titik Diperiksa': item.totalContainers,
    'Titik Positif Jentik': item.positiveContainers,
    'Status ABJ': item.status === 'bebas_jentik' ? 'BEBAS JENTIK (100%)' : 'DITEMUKAN JENTIK',
    'Terverifikasi Kader': item.verifiedByKader ? 'Ya' : 'Belum',
    'Catatan / Tindakan PSN': item.notes || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap_1R1J');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 14 },
    { wch: 30 },
    { wch: 8 },
    { wch: 8 },
    { wch: 18 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
    { wch: 40 },
  ];

  XLSX.writeFile(workbook, `SiJumantik_Rekap_1R1J_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportSingleInspectionToPdf = (inspection: HomeInspectionRecord) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(16, 149, 107);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('KARTU KONTROL PANTAU JENTIK RUMAH TANGGA (1R1J)', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Program Nasional Pengendalian Demam Berdarah Dengue • Kemenkes RI', 14, 19);
  doc.text(`No. Registrasi: 1R1J-${inspection.id.toUpperCase()}`, 14, 24);

  // Household Details Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 34, 182, 34, 3, 3, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('IDENTITAS RUMAH TANGGA', 18, 40);

  doc.setFont('helvetica', 'normal');
  doc.text(`Alamat Rumah  : ${inspection.houseAddress}, RT ${inspection.rt} / RW ${inspection.rw}`, 18, 46);
  doc.text(`Kelurahan      : ${inspection.kelurahan}`, 18, 52);
  doc.text(`Nama Jumantik  : ${inspection.inspectorName}`, 18, 58);
  doc.text(`Tanggal Pantau: ${inspection.date}`, 18, 64);

  // Status Badge
  const isClean = inspection.status === 'bebas_jentik';
  doc.setFillColor(isClean ? 220 : 254, isClean ? 252 : 226, isClean ? 231 : 226);
  doc.roundedRect(130, 40, 60, 22, 2, 2, 'F');
  doc.setTextColor(isClean ? 16 : 220, isClean ? 149 : 38, isClean ? 107 : 38);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(isClean ? '✅ BEBAS JENTIK' : '⚠️ POSITIF JENTIK', 135, 49);
  doc.setFontSize(8);
  doc.text(`Skor ABJ: ${isClean ? '100%' : '0% (Perlu PSN)'}`, 135, 56);

  // Points Checklist Table
  const pointsData = inspection.points.map((pt, idx) => [
    idx + 1,
    pt.name,
    pt.hasLarvae ? 'POSITIF JENTIK' : 'BEBAS JENTIK (Bersih)',
    pt.actionTaken || 'Dipantau rutin & dibersihkan'
  ]);

  autoTable(doc, {
    startY: 72,
    head: [['No', 'Titik Genangan / Wadah Air Diperiksa', 'Status Temuan', 'Tindakan PSN 3M+']],
    body: pointsData,
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 65, fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      if (data.column.index === 2 && data.section === 'body') {
        if (data.cell.raw === 'POSITIF JENTIK') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [16, 149, 107];
        }
      }
    }
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 190;

  // PSN 3M+ Notes Box
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(14, finalY, 182, 22, 2, 2, 'FD');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CATATAN KADER & INSTRUKSI PSN 3M PLUS:', 18, finalY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    inspection.notes || 'Lakukan pengurasan bak mandi seminggu sekali, tutup rapat penampung air toren, dan daur ulang wadah berpotensi genangan.',
    18,
    finalY + 10,
    { maxWidth: 174 }
  );

  // Signatures
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text('Jumantik Mandiri Keluarga,', 20, finalY + 32);
  doc.text(`( ${inspection.inspectorName} )`, 20, finalY + 48);

  doc.text('Kader Jumantik RW / Koordinator,', 130, finalY + 32);
  doc.text('( .................................................. )', 130, finalY + 48);

  doc.save(`Kartu_Pantau_1R1J_${inspection.houseAddress.replace(/[^a-zA-Z0-9]/g, '_')}_${inspection.date}.pdf`);
};

/**
 * ====================================================================
 * 2. EXPORT DATA PASIEN & KASUS DBD (PUSKESMAS / DINAS KESEHATAN)
 * ====================================================================
 */

export const exportDengueCasesToPdf = (cases: DengueCaseReport[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(185, 28, 28); // Red color
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('PUSKESMAS SUKAMAJU - SURVEILANS & REKAPITULASI PASIEN DBD', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sistem Informasi Terpadu Pengendalian Demam Berdarah Dengue • Dicetak: ${getTodayDateStr()}`, 14, 18);

  // Summary stats
  const rawatInap = cases.filter((c) => c.status === 'rawat_inap').length;
  const icu = cases.filter((c) => c.status === 'rujukan_icu').length;
  const fogging = cases.filter((c) => c.foggingScheduled).length;

  doc.setTextColor(30, 41, 59);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 28, 60, 16, 2, 2, 'F');
  doc.roundedRect(80, 28, 60, 16, 2, 2, 'F');
  doc.roundedRect(146, 28, 60, 16, 2, 2, 'F');
  doc.roundedRect(212, 28, 71, 16, 2, 2, 'F');

  doc.setFontSize(8);
  doc.text('Total Kasus Tercatat', 18, 33);
  doc.text('Pasien Rawat Inap', 84, 33);
  doc.text('Rujukan ICU / Syok (DSS)', 150, 33);
  doc.text('Fogging Fokus Terjadwal', 216, 33);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${cases.length} Pasien`, 18, 40);
  doc.setTextColor(220, 38, 38);
  doc.text(`${rawatInap} Pasien`, 84, 40);
  doc.setTextColor(185, 28, 28);
  doc.text(`${icu} Pasien`, 150, 40);
  doc.setTextColor(147, 51, 234);
  doc.text(`${fogging} Lokasi`, 216, 40);

  const tableData = cases.map((c, idx) => [
    idx + 1,
    c.patientInitials,
    `${c.gender} / ${c.age} th`,
    c.address,
    c.rtRw,
    `Hari ke-${c.feverDay}`,
    c.diagnosis,
    c.plateletCount ? `${c.plateletCount.toLocaleString()} /uL` : '-',
    `${c.hematocrit}%`,
    c.status.toUpperCase().replace('_', ' '),
    c.foggingScheduled ? 'YA (Terjadwal)' : 'Belum',
    c.reportedAt
  ]);

  autoTable(doc, {
    startY: 48,
    head: [[
      'No',
      'Pasien',
      'JK/Usia',
      'Alamat Domisili',
      'RT / RW',
      'Demam',
      'Diagnosis Klinis',
      'Trombosit',
      'Ht (%)',
      'Status Rawat',
      'Fogging Fokus',
      'Waktu Lapor'
    ]],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 18 },
      3: { cellWidth: 42 },
      4: { cellWidth: 22 },
      5: { cellWidth: 16 },
      6: { cellWidth: 32, fontStyle: 'bold' },
      7: { cellWidth: 22 },
      8: { cellWidth: 14 },
      9: { cellWidth: 28 },
      10: { cellWidth: 22 },
      11: { cellWidth: 'auto' },
    }
  });

  doc.save(`SiJumantik_Rekap_Kasus_DBD_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportDengueCasesToExcel = (cases: DengueCaseReport[]) => {
  const data = cases.map((c, idx) => ({
    'No': idx + 1,
    'Inisial Pasien': c.patientInitials,
    'Jenis Kelamin': c.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    'Usia (Tahun)': c.age,
    'Alamat Lengkap': c.address,
    'RT / RW': c.rtRw,
    'Hari Demam': c.feverDay,
    'Diagnosis Klinis': c.diagnosis,
    'Trombosit (/uL)': c.plateletCount || 0,
    'Hematokrit (%)': c.hematocrit,
    'Status Pasien': c.status,
    'Faskes Perawat': c.faskesName,
    'Jadwal Fogging Fokus': c.foggingScheduled ? (c.foggingDate || 'Terjadwal') : 'Tidak',
    'Waktu Dilaporkan': c.reportedAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pasien_DBD');

  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 14 },
    { wch: 12 },
    { wch: 35 },
    { wch: 16 },
    { wch: 12 },
    { wch: 24 },
    { wch: 16 },
    { wch: 14 },
    { wch: 18 },
    { wch: 22 },
    { wch: 22 },
    { wch: 20 },
  ];

  XLSX.writeFile(workbook, `SiJumantik_Rekap_Kasus_DBD_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * ====================================================================
 * 3. EXPORT STOK LOGISTIK MEDIS & PENGENDALIAN VEKTOR
 * ====================================================================
 */

export const exportLogisticsToPdf = (logistics: LogisticsItem[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(14, 116, 144); // Cyan color
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN DISTRIBUSI LOGISTIK MEDIS & VEKTOR DBD', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Puskesmas Kecamatan Sukamaju • Dicetak: ${getTodayDateStr()}`, 14, 18);

  const tableData = logistics.map((item, idx) => [
    idx + 1,
    item.name,
    item.category,
    `${item.quantity} ${item.unit}`,
    item.status.toUpperCase(),
    item.allocatedTo,
    item.lastUpdated
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['No', 'Nama Barang / Logistik', 'Kategori', 'Jumlah Stok', 'Status', 'Alokasi Distribusi', 'Update Terakhir']],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 45, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 22, fontStyle: 'bold' },
      4: { cellWidth: 20 },
      5: { cellWidth: 40 },
      6: { cellWidth: 'auto' }
    }
  });

  doc.save(`SiJumantik_Stok_Logistik_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportLogisticsToExcel = (logistics: LogisticsItem[]) => {
  const data = logistics.map((item, idx) => ({
    'No': idx + 1,
    'Nama Barang / Logistik': item.name,
    'Kategori': item.category,
    'Jumlah Tersedia': item.quantity,
    'Satuan': item.unit,
    'Status Stok': item.status.toUpperCase(),
    'Alokasi Wilayah': item.allocatedTo,
    'Terakhir Diperbarui': item.lastUpdated
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Stok_Logistik');
  XLSX.writeFile(workbook, `SiJumantik_Stok_Logistik_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * ====================================================================
 * 4. EXPORT LAPORAN TITIK RAWAN KOMUNITAS
 * ====================================================================
 */

export const exportCommunityReportsToPdf = (reports: CommunityReport[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(5, 150, 105); // Emerald-teal color
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN PARTISIPASI WARGA: TITIK RAWAN JENTIK', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sistem Validasi Komunitas Gotong Royong • Dicetak: ${getTodayDateStr()}`, 14, 18);

  const tableData = reports.map((r, idx) => [
    idx + 1,
    r.title,
    r.category.replace('_', ' '),
    `${r.address} (${r.rtRw})`,
    r.reporterName,
    `${r.upvotes} Warga`,
    r.status.replace('_', ' ').toUpperCase(),
    r.createdAt
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['No', 'Judul Laporan', 'Kategori', 'Lokasi / Alamat', 'Pelapor', 'Dukungan', 'Status Tindakan', 'Waktu Lapor']],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 40, fontStyle: 'bold' },
      2: { cellWidth: 26 },
      3: { cellWidth: 42 },
      4: { cellWidth: 24 },
      5: { cellWidth: 16 },
      6: { cellWidth: 24 },
      7: { cellWidth: 'auto' }
    }
  });

  doc.save(`SiJumantik_Laporan_Komunitas_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportCommunityReportsToExcel = (reports: CommunityReport[]) => {
  const data = reports.map((r, idx) => ({
    'No': idx + 1,
    'Judul Temuan': r.title,
    'Kategori Genangan': r.category,
    'Deskripsi': r.description,
    'Alamat Lokasi': r.address,
    'RT / RW': r.rtRw,
    'Nama Pelapor': r.reporterName,
    'Jumlah Validasi Upvote': r.upvotes,
    'Status Tindak Lanjut': r.status,
    'Tindak Lanjut Satgas': r.actionNote || '-',
    'Tanggal Lapor': r.createdAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan_Komunitas');
  XLSX.writeFile(workbook, `SiJumantik_Laporan_Komunitas_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * ====================================================================
 * 5. MASTER EXECUTIVE COMPREHENSIVE REPORT (ALL-IN-ONE)
 * ====================================================================
 */

export const exportComprehensiveMasterExcel = (
  inspections: HomeInspectionRecord[],
  cases: DengueCaseReport[],
  logistics: LogisticsItem[],
  reports: CommunityReport[],
  zones: AreaZone[]
) => {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Ringkasan Wilayah (Zones & ABJ)
  const zoneSummary = zones.map((z, idx) => ({
    'No': idx + 1,
    'Nama Wilayah': z.name,
    'RT / RW': z.rtRw,
    'Kelurahan': z.kelurahan,
    'Tingkat Kerawanan': z.riskLevel.toUpperCase(),
    'Angka Bebas Jentik (ABJ %)': `${z.abj}%`,
    'House Index (HI %)': `${z.houseIndex}%`,
    'Container Index (CI %)': `${z.containerIndex}%`,
    'Breteau Index (BI)': z.breteauIndex,
    'Total Rumah': z.totalHouses,
    'Rumah Diperiksa': z.inspectedHouses,
    'Rumah Positif Jentik': z.positiveHouses,
    'Kasus DBD Aktif': z.activeCases
  }));
  const wsZones = XLSX.utils.json_to_sheet(zoneSummary);
  XLSX.utils.book_append_sheet(workbook, wsZones, '1_Ringkasan_Wilayah');

  // Sheet 2: Inspeksi 1R1J
  const inspData = inspections.map((i, idx) => ({
    'No': idx + 1,
    'Tanggal': i.date,
    'Alamat': i.houseAddress,
    'RT': i.rt,
    'RW': i.rw,
    'Jumantik': i.inspectorName,
    'Total Wadah': i.totalContainers,
    'Positif Jentik': i.positiveContainers,
    'Status': i.status,
    'Catatan': i.notes
  }));
  const wsInsp = XLSX.utils.json_to_sheet(inspData);
  XLSX.utils.book_append_sheet(workbook, wsInsp, '2_Pemantauan_1R1J');

  // Sheet 3: Kasus Pasien DBD
  const casesData = cases.map((c, idx) => ({
    'No': idx + 1,
    'Pasien': c.patientInitials,
    'Usia': c.age,
    'JK': c.gender,
    'Alamat': c.address,
    'RT/RW': c.rtRw,
    'Diagnosis': c.diagnosis,
    'Trombosit': c.plateletCount,
    'Hematokrit': c.hematocrit,
    'Status': c.status,
    'Fogging': c.foggingScheduled ? 'Ya' : 'Tidak'
  }));
  const wsCases = XLSX.utils.json_to_sheet(casesData);
  XLSX.utils.book_append_sheet(workbook, wsCases, '3_Pasien_DBD');

  // Sheet 4: Stok Logistik
  const logData = logistics.map((l, idx) => ({
    'No': idx + 1,
    'Barang': l.name,
    'Kategori': l.category,
    'Stok': l.quantity,
    'Satuan': l.unit,
    'Status': l.status,
    'Alokasi': l.allocatedTo
  }));
  const wsLog = XLSX.utils.json_to_sheet(logData);
  XLSX.utils.book_append_sheet(workbook, wsLog, '4_Stok_Logistik');

  // Sheet 5: Laporan Publik
  const comData = reports.map((r, idx) => ({
    'No': idx + 1,
    'Judul': r.title,
    'Kategori': r.category,
    'Alamat': r.address,
    'Pelapor': r.reporterName,
    'Validasi Upvote': r.upvotes,
    'Status': r.status
  }));
  const wsCom = XLSX.utils.json_to_sheet(comData);
  XLSX.utils.book_append_sheet(workbook, wsCom, '5_Laporan_Warga');

  XLSX.writeFile(workbook, `SiJumantik_Master_Report_Komprehensif_${new Date().toISOString().split('T')[0]}.xlsx`);
};
