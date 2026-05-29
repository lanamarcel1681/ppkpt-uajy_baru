const fs = require('fs');

const files = [
  "d:/repo/ppkpt-uajy/components/daftar_laporan/laporanTable.tsx",
  "d:/repo/ppkpt-uajy/app/login_Admin/page.tsx",
  "d:/repo/ppkpt-uajy/app/login/page.tsx",
  "d:/repo/ppkpt-uajy/app/dashboard/tahun-akademik/page.tsx",
  "d:/repo/ppkpt-uajy/app/dashboard/roles/page.tsx",
  "d:/repo/ppkpt-uajy/app/dashboard/kelola_panduan/page.tsx",
  "d:/repo/ppkpt-uajy/app/dashboard/fakultas_prodi/page.tsx",
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  let o = c;
  
  c = c.replace(/alert\((.*?)\)/g, (m, g1) => {
    let l = g1.toLowerCase();
    if (l.includes('berhasil') || l.includes('dihapus') || l.includes('edit')) return 'toast.success(' + g1 + ')';
    if (l.includes('pengembangan')) return 'toast(' + g1 + ')';
    return 'toast.error(' + g1 + ')';
  });
  
  if (c !== o) {
    if (!c.includes('react-hot-toast')) {
      c = c.replace(/(import .*?;?\n)/, "$1import toast from 'react-hot-toast';\n");
    }
    fs.writeFileSync(f, c);
    console.log('Updated ' + f);
  }
});
