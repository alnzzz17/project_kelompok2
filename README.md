# TESTING

## PRIO

#### addAdmin di postUser (Resepsionis)
```
{
  "idRsp": "0104",
  "userName": "rspLuffy",
  "fullName": "Monkey D. Luffy",
  "password": "kaizokuou",
  "email": "luffy@gmail.com",
  "phoneNumber": "08964534567"
}
```
*nantinya default role Resepsionis, diganti manual di db

#### post rsp
```
{
  "idRsp": "01X12345",
  "fullName": "John Doe",
  "password": "securepassword",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890"
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
{
  "idPasien": "03X12345",
  "idNumber": "987654321",
  "fullName": "Jane Doe",
  "password": "securepassword",
  "email": "jane.doe@example.com",
  "phoneNumber": "0987654321"
}

**#### PostDokter**
{
  "idDokter": "02X12345",
  "sipNumber": "1234567890",
  "fullName": "Dr. Smith",
  "password": "securepassword",
  "email": "dr.smith@example.com",
  "phoneNumber": "1231231234",
  "specialize": "Cardiology",
  "poli": "Cardiology Department"
}


#### getUserById
#### getAllUserByRole
#### login
{
  "id": "01X12345",
  "password": "securepassword"
}


#### deleteUser


#### editUserAccount
{
  "idNumber": "987654321",
  "fullName": "Jane Doe",
  "password": "newsecurepassword",
  "email": "new.jane.doe@example.com",
  "phoneNumber": "0987654321",
  "emergencyContact": "John Doe",
  "birthDate": "1990-01-01",
  "gender": "Female",
  "personalAddress": "123 Main St",
  "historyPenyakit": "None",
  "allergies": "None"
}

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
