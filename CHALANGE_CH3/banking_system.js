class BankAcount{
    
    constructor(){
        this.saldo = 0
    }

    notif(){
        setTimeout(() =>console.log('Saldo anda saat ini adalah Rp'+this.saldo), 3000)
    }

    deposit(depo){
        this.saldo += +depo
        console.log('Anda berhasil melakukan deposit sebanyak Rp'+ depo)
    }

    withdraw(kredit){
        if (this.saldo >= kredit){
            this.saldo -= +kredit 
            console.log('Anda berhasil melakukan withdraw sebanyak Rp' + kredit)
        } else {
            console.log('Err : Saldo anda tidak mencukupi untuk melakukan withdraw sebesar Rp' + kredit)
        }
    }
}

let people = new BankAcount
people.deposit(1000)
people.withdraw(2000)
people.withdraw(400)
people.deposit(500)

people.notif()