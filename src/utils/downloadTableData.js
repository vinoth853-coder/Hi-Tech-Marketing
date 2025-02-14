import * as XLSX from 'xlsx';

export const downloadExcel = (data, year, taxType, type) => {
  let selectedData;
  let filename;
  console.log(data);
  if (type === 1) {
    selectedData = data.map((item, index) => {
      if (year === '' && taxType === '') {
        filename = 'Overall Pending Tax Details'
        return {
          "S.no": index + 1,
          "Family ID": item.id,
          "Head Name": item.head_name,
          "Overall Pendings": item.remaining_amount,
          "Contact Number": item.contact,
          "Status": item.is_active ? "Active" : "Inactive"
        };
      } else if (year && taxType === ''){ 
        filename = `${year} - Pending Tax Details`;
        const tax = item.tax.find((t) => t.feast_tax.tax_year === String(year) || t.festival_tax.tax_year === String(year));
        return {
          "S.no": index + 1,
          "Family ID": item.id,
          "Head Name": item.head_name,
          "Pending Amount": `₹${tax ? tax.remaining_amount : 0}`,
          "Contact Number": item.contact,
          "Status": item.is_active ? "Active" : "Inactive"
        };
      } else if (year && taxType === 'Festival Tax') {
        filename = `${year} - ${taxType} Details`
        return {
          "S.no": index + 1,
          "Family ID": item.id,
          "Head Name": item.head_name,
          "Festival Tax Count": item.tax.find((t) => t.festival_tax.tax_year === String(year))?.festival_tax.total_tax_count || 0,
          "Determined Festival Tax": item.tax.find((detail) => detail.festival_tax.tax_year === String(year))?.festival_tax.total_festival_tax?.toFixed(2) || 0,
          "Pending Festival Tax": item.tax.find((detail) => detail.festival_tax.tax_year === String(year))?.festival_tax.festival_pending_amount?.toFixed(2) || 0,
          "Contact Number": item.contact,
          "Status": item.is_active ? "Active" : "Inactive"
        };
      } else if (year && taxType === 'Feast Tax') {
        filename = `${year} - ${taxType} Details`
        return {
          "S.no": index + 1,
          "Family ID": item.id,
          "Head Name": item.head_name,
          "Feast Tax Count": item.tax.find((t) => t.feast_tax.tax_year === String(year))?.feast_tax.total_tax_count || 0,
          "Determined Feast Tax": item.tax.find((detail) => detail.feast_tax.tax_year === String(year))?.feast_tax.total_feast_tax?.toFixed(2) || 0,
          "Pending Feast Tax": item.tax.find((detail) => detail.feast_tax.tax_year === String(year))?.feast_tax.feast_pending?.toFixed(2) || 0,
          "Contact Number": item.contact,
          "Status": item.is_active ? "Active" : "Inactive"
        };
      } else if (year && taxType === 'Both Tax') {
        filename = `${year} - ${taxType} Details`
        return {
          "S.no": index + 1,
          "Family ID": item.id,
          "Head Name": item.head_name,
          "Determined Feast Tax": item.tax.find((detail) => detail.feast_tax.tax_year === String(year))?.feast_tax.total_feast_tax?.toFixed(2) || 0,
          "Pending Feast Tax": item.tax.find((detail) => detail.feast_tax.tax_year === String(year))?.feast_tax.feast_pending_amount?.toFixed(2) || 0,
          "Determined Festival Tax": item.tax.find((detail) => detail.festival_tax.tax_year === String(year))?.festival_tax.total_festival_tax?.toFixed(2) || 0,
          "Pending Festival Tax": item.tax.find((detail) => detail.festival_tax.tax_year === String(year))?.festival_tax.festival_pending_amount?.toFixed(2) || 0,
          "Contact Number": item.contact,
          "Status": item.is_active ? "Active" : "Inactive"
        };
      }
    });
  } else if (type === 2) {
    selectedData = data.map((item, index) => {
      if (year === 'All') {
        filename = 'Overall Donations'
        return {
          "S.no": index + 1,
          "Receipt No.": item.receipt_number,
          "Family ID": item.family_id,
          "Head Name": item.head_name,
          "Contact Number": item.contact,
          "Amount Paid": item.amount,
          "Payment mode": item.payment_mode,
          "Paid At": item.paid_at
        };
      } else if (year && year !== 'All'){ 
        filename = `${year} - Donations`;
        return {
          "S.no": index + 1,
          "Receipt No.": item.receipt_number,
          "Family ID": item.family_id,
          "Head Name": item.head_name,
          "Contact Number": item.contact,
          "Amount Paid": item.amount,
          "Payment mode": item.payment_mode,
          "Paid At": item.paid_at
        };
      }
    });
  }
  const worksheet = XLSX.utils.json_to_sheet(selectedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
