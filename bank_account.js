let saldo = 0

function tambahsaldo(){
    let tambah = window.prompt("Tambah Saldo Kamu!")
    saldo += +tambah
}

function kurangisaldo(){
    let kurang = window.prompt("Kurangi Saldo mu!")
    saldo -= +kurang
}

let ulang = true
do {
    let home = window.prompt(`Pilih menu : 
    1. cek saldo
    2. tambah
    3. kurang
    4. keluar`)

    switch(Number(home)){
        case 1:
            window.alert (`saldo anda saat ini Rp ${saldo}`)
            break
        case 2:
            tambahsaldo()
            window.alert (`Saldo Anda = ${saldo}`)
            break
        case 3:
            kurangisaldo()
            window.alert (`Saldo Anda = ${saldo}`)
            break
        case 4:
            ulang = false
            break
        default :
            alert("Pilihan tidak ada")
    }
    // ulang = window.confirm("ulang aplikasi?")
} while(ulang)



