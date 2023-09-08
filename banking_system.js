class BankAcount{
    
    constructor(){
        this.saldo = 0
    }
    deposit(depo){
        let Depo = this.saldo += +depo
        console.log(`Anda Berhasil deposit sebanyak ${depo}
Saldo anda saat ini Rp${Depo}`)
    }

    withdraw(kredit){
        if (this.saldo >= kredit){
            let Kredit = this.saldo -= +kredit 
            console.log(`Anda Berhasil Withdraw sebanyak ${kredit}
Saldo anda saat ini Rp${Kredit}`)
        } else {
            console.log('Err : Saldo anda tidak mencukupi untuk melakukan withdraw sebesar Rp' + kredit)
        }
    }
}

let people = new BankAcount
people.deposit(1000)
people.withdraw(2000)
people.withdraw(150)
people.deposit(500)