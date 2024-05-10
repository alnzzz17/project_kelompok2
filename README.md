# TESTING

## PRIO

#### addAdmin di postUser (Resepsionis)
```
{
    idRsp : '0101',
    userName : 'adm_prtm',
    fullName : 'Admin Pratama',
    password: 'adminpratama0710',
    email : 'adminpratama@gmail.com',
    phoneNumber : '089537378965',
}
```
*nantinya default role Resepsionis, diganti manual di db

#### postUser : Dokter
```
{
    idDokter: '0201',
    sipNumber: '123/abcd/345/2016',
    fullName: 'Dr. Amin Hidayat',
    password: 'doktoraminpass',
    email: 'amin@gmail.com,
    phoneNumber: '086476243687',
    specialize: 'Umum',
    poli: 'Umum'
}
```
        
#### addJadwal
```
{
    idDokter: '0201',
    schedule: {
        "Senin": "16.00 - 20.00",
        "Rabu": "10.00 - 16.00",
        "Sabtu": "08.00 - 14.00"
    }
}
```

#### postResepsionis
#### postPasien
#### getUserById
#### getAllUserByRole
#### login
#### deleteUser
#### editUserAccount
#### editJadwal
#### deleteJadwal
#### getAllJadwal
#### getAllAppoint
#### addAppoint
#### deleteAppoint
#### editAppointDetail
#### getAppointById
#### getAppointByPasien
#### getAppointByDokter
#### getAppointByPoli

## OPS

#### getUserByToken