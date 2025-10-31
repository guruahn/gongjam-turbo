# 시그널플로우 스크래핑 API Documentation

## ChangeLog
- 2025-08-25: GET /scrapping/v1/guaranty_types 추가
- 2025-08-10: coverage_analysis endpoint 설명 추가
- 2025-05-09: 요청이나 응답에서 GUID제거, 인증 요청 헤더 X-Api-Key 추가 (Authentication 제거)
- 2025-04-29: 최초 메뉴얼 생성

## API 목록

- [POST /scrapping/v1/contracts](#post-scrappingv1contracts)
- [GET /scrapping/v1/contracts](#get-scrappingv1contracts)
- [DELETE /scrapping/v1/contracts](#delete-scrappingv1contracts)
- [GET /scrapping/v1/payment](#get-scrappingv1payment)
- [GET /scrapping/v1/payment_timeline](#get-scrappingv1paymenttimeline)
- [GET /scrapping/v1/coverage_analysis](#get-scrappingv1coverageanalysis)
- [GET /scrapping/v1/guaranty_types](#get-scrappingv1guarantytypes)

## POST /scrapping/v1/contracts

### 개요
> 스크래핑한 고객의 보험데이터를 보장분석을 위한 용도로 저장합니다.

### 요청

- **Method**: `POST`
- **URL**: `/scrapping/v1/contracts`
- **Content-Type**: `application/json`
- **Headers**:
    - `X-Api-Key: {token}`

#### Request Body
| 이름                                           | 타입            | 필수 여부     | 설명                      |
|----------------------------------------------|---------------|-----------|-------------------------|
| contracts                                    | array<object> | Y         | 계약 정보 목록                |
| contracts[].state                            | string        | N         | 계약 상태 (정상, 만기 등등)       |
| contracts[].companyName                      | string        | Y         | 보험사명                    |
| contracts[].productName                      | string        | Y         | 보험 상품명                  |
| contracts[].contractNumber                   | string        | Y         | 계약 번호                   |
| contracts[].contractor                       | string        | N         | 계약자                     |
| contracts[].coverStartDate                   | string        | N         | 주계약 보장 시작일 (YYYY-MM-DD) |
| contracts[].coverEndDate                     | string        | N         | 주계약 보장 종료일 (YYYY-MM-DD) |
| contracts[].premium                          | number        | N (>= 0)  | 보험료                     |
| contracts[].premiumCycle                     | string        | N         | 보험료 납입 주기               |
| contracts[].premiumDuration                  | number        | N (>= 0)  | 보험료 납입 기간 (년단위)         |
| contracts[].guaranties                       | array<object> | N         | 보장 내역 목록                |
| contracts[].guaranties[].code                | string        | N (최대 5자) | 신정원 담보 코드               |
| contracts[].guaranties[].guarantyName        | string        | Y         | 신정원 담보명                 |
| contracts[].guaranties[].companyGuarantyName | string        | Y         | 회사 담보명                  |
| contracts[].guaranties[].state               | string        | N         | 담보 상태 (정상, 만기 등등)       |
| contracts[].guaranties[].insurant            | string        | Y         | 피보험자                    |
| contracts[].guaranties[].coverStartDate      | string        | N         | 담보 보장 시작일 (YYYY-MM-DD)  |
| contracts[].guaranties[].coverEndDate        | string        | N         | 담보 보장 종료일 (YYYY-MM-DD)  |
| contracts[].guaranties[].coverageAmount      | number        | N (>= 0)  | 보장 금액                   |

```json
{
  "contracts": [
    {
      "state": "active",
      "companyName": "시그널플로우생명보험",
      "productName": "좋은암보험",
      "contractNumber": "CNTR-1234",
      "contractor": "이주헌",
      "coverStartDate": "2023-01-01",
      "coverEndDate": "2033-01-01",
      "premium": 50000,
      "premiumCycle": "월납",
      "premiumDuration": 120,
      "guaranties": [
        {
          "code": "A001",
          "guarantyName": "입원보장",
          "companyGuarantyName": "메트 입원보장",
          "state": "active",
          "insurant": "이주헌",
          "coverStartDate": "2023-01-01",
          "coverEndDate": "2033-01-01",
          "coverageAmount": 10000000
        }
        // ...
      ]
    }
    // ...
  ]
}
```

### 응답

#### Status Codes
| HTTP Status | 설명 |
|:------------|:-----|
| 200 OK | 요청 성공 |
| 400 Bad Request | 잘못된 요청 (파라미터 오류 등) |
| 401 Unauthorized | 인증 실패 |
| 500 Internal Server Error | 서버 내부 오류 |

#### Response Body

| 이름          | 타입     | 필수 여부 | 설명                                  |
|-------------|--------|-------|-------------------------------------|
| code        | number | Y     | 결과 코드 (1=성공, 기타=오류)                 |
| message     | string | Y     | 결과 메시지                              |
| result      | object | Y     | 결과 데이터                              |
| result.uuid | string | Y     | 생성된 계약 UUID. 읽기 전용 API 호출시 식별자로 사용. |

#### 📄 Response 예시

```json
{
  "code": 1,
  "message": "",
  "result": {
    "uuid": "de305d54-75b4-431b-adb2-eb6b9e546014" // 읽기 전용 API 호출시 계약의 식별자로 사용
  }
}
```

## GET /scrapping/v1/contracts

### 개요
> 계약 목록을 조회합니다.
> (납입내역과 관련한 항목들은 입력된 값들로부터 예측된 값이며 실제 납부한 내역이 아닙니다.)

### 요청

- **Method**: `GET`
- **URL**: `/scrapping/v1/contracts`
- **Content-Type**: application/json
- **Headers**:
    - `X-Api-Key: {token}`

#### Query String Parameters

| 이름 | 타입 | 필수 여부 | 예시 | 설명 |
|:-----|:-----|:---------|:----|:----|
| identifier.uuid | string(UUID) | N | `a1e2b3c4-d5f6-7890-abcd-ef1234567890` | UUID 형식 식별자 |
| birthdate | string | Y | `1990-01-01` | 피보험자 생년월일 (YYYY-MM-DD) |
| insurant | string | N | `이주헌` | 피보험자 이름 |
| state | string | N | `정상` | 계약 상태 |
| guarantyState | string | N | `정상` | 보장 상태 |

### 응답

#### Status Codes

| HTTP Status | 설명 |
|:------------|:-----|
| 200 OK | 요청 성공 |
| 400 Bad Request | 잘못된 요청 |
| 401 Unauthorized | 인증 실패 |
| 500 Internal Server Error | 서버 내부 오류 |

#### Response Body

| 이름                                        | 타입            | 설명                  |
|-------------------------------------------|---------------|---------------------|
| code                                      | number        | 결과 코드 (1=성공, 기타=오류) |
| message                                   | string        | 결과 메시지              |
| result                                    | array<object> | 계약 정보 목록            |
| result[].state                            | string        | 계약 상태               |
| result[].companyName                      | string        | 보험사명                |
| result[].companyPhoneNumber               | string        | 보험사 전화번호            |
| result[].companyFaxNumber                 | string        | 보험사 팩스번호            |
| result[].companyLogoUrl                   | string        | 보험사 로고 URL          |
| result[].companyType                      | string        | 보험사 종류              |
| result[].productName                      | string        | 보험 상품명              |
| result[].productDisclosureUrl             | string        | 상품 약관 URL           |
| result[].productType                      | string        | 상품 종류               |
| result[].contractNumber                   | string        | 계약 번호               |
| result[].contractor                       | string        | 계약자                 |
| result[].premium                          | number        | 보험료                 |
| result[].premiumCycle                     | string        | 납입 주기               |
| result[].premiumDuration                  | number        | 납입 기간               |
| result[].coverAge                         | number        | 보장 나이               |
| result[].coverStartDate                   | string        | 보장 시작일              |
| result[].coverEndDate                     | string        | 보장 종료일              |
| result[].createdAt                        | string        | 계약 생성일              |
| result[].tags                             | array<string> | 계약 태그 목록            |
| result[].payment                          | object        | 납입 정보               |
| result[].payment.totalAmount              | number        | 총 납입액               |
| result[].payment.paidAmount               | number        | 납입 완료 금액            |
| result[].payment.notPaidAmount            | number        | 미납 금액               |
| result[].payment.totalCount               | number        | 총 납입 횟수             |
| result[].payment.paidCount                | number        | 납입 완료 횟수            |
| result[].payment.notPaidCount             | number        | 미납 횟수               |
| result[].payment.percent                  | number        | 납입 비율(%)            |
| result[].payment.monthlyPremium           | number        | 월 보험료               |
| result[].payment.until                    | string        | 최종 납입일              |
| result[].guaranties                       | array<object> | 보장 내역 목록            |
| result[].guaranties[].code                | string        | 보장 코드               |
| result[].guaranties[].guarantyName        | string        | 보장명                 |
| result[].guaranties[].companyGuarantyName | string        | 회사 보장명              |
| result[].guaranties[].state               | string        | 보장 상태               |
| result[].guaranties[].insurant            | string        | 피보험자                |
| result[].guaranties[].coverAge            | number        | 보장 시작 나이            |
| result[].guaranties[].coverStartDate      | string        | 보장 시작일              |
| result[].guaranties[].coverEndDate        | string        | 보장 종료일              |
| result[].guaranties[].coverageAmount      | number        | 보장 금액               |
| result[].guaranties[].guarantyTypes       | array<string> | 보장 분류 목록            |
| result[].guaranties[].tags                | array<string> | 보장 태그 목록            |

### 📄 Response 예시

```json
{
  "code": 1,
  "message": "",
  "result": [
    {
      "state": "정상",
      "companyName": "시그널플래너생명보험",
      "companyPhoneNumber": "02-1234-5678",
      "companyFaxNumber": "02-8765-4321",
      "companyLogoUrl": "https://example.com/logo.png",
      "companyType": "생명보험",
      "productName": "좋은암보험",
      "productDisclosureUrl": "https://example.com/disclosure",
      "productType": "정기보험",
      "contractNumber": "CNTR-5678",
      "contractor": "이주헌",
      "premium": 50000,
      "premiumCycle": "월납",
      "premiumDuration": 120,
      "coverAge": 30.5,
      "coverStartDate": "2023-01-01",
      "coverEndDate": "2033-01-01",
      "createdAt": "2023-01-01T00:00:00Z",
      "tags": ["실손포함"],
      "payment": {
        "totalAmount": 6000000,
        "paidAmount": 1500000,
        "notPaidAmount": 4500000,
        "totalCount": 120,
        "paidCount": 30,
        "notPaidCount": 90,
        "percent": 25,
        "monthlyPremium": 50000,
        "until": "2024-01-01"
      },
      "guaranties": [
        {
          "code": "A001",
          "guarantyName": "암보장",
          "companyGuarantyName": "메트암보장",
          "state": "정상",
          "insurant": "이주헌",
          "coverAge": 30,
          "coverStartDate": "2023-01-01",
          "coverEndDate": "2033-01-01",
          "coverageAmount": 10000000,
          "guarantyTypes": ["암진단비"],
          "tags": ["CI"]
        }
        // ...
      ]
    }
    // ...
  ]
}
```

## DELETE /scrapping/v1/contracts/:uuid

### 개요
> 특정 계약 정보를 삭제합니다.

### 요청

- **Method**: `DELETE`
- **URL**: `/scrapping/v1/contracts/:uuid`
- **Content-Type**: application/json
- **Headers**:
    - `X-Api-Key: {token}`

#### Path Parameters

| 이름 | 타입 | 필수 여부 | 예시 | 설명 |
|:-----|:-----|:---------|:----|:----|
| uuid | string(UUID) | Y | `a1e2b3c4-d5f6-7890-abcd-ef1234567890` | UUID 형식 계약 식별자 |

### 응답

#### Status Codes

| HTTP Status | 설명 |
|:------------|:-----|
| 200 OK | 삭제 성공 |
| 400 Bad Request | 잘못된 요청 (예: 유효하지 않은 GUID/UUID) |
| 401 Unauthorized | 인증 실패 |
| 500 Internal Server Error | 서버 내부 오류 |

#### Response Body

| 이름      | 타입     | 필수 여부 | 설명                  |
|---------|--------|-------|---------------------|
| code    | number | Y     | 결과 코드 (1=성공, 기타=오류) |
| message | string | Y     | 결과 메시지              |

#### 📄 Response 예시

```json
{
  "code": 1,
  "message": ""
}
```

## GET /scrapping/v1/payment

### 개요
> 납입 정보(Payment)를 조회합니다.
> 전체, 보장성, 저축성 / 저축성(연금), 저축성(연금저축) 별로 납입 정보를 계산하여 표시합니다.

### 요청

- **Method**: `GET`
- **URL**: `/scrapping/v1/payment`
- **Content-Type**: application/json
- **Headers**:
    - `X-Api-Key: {token}`

#### Query String Parameters

| 이름 | 타입 | 필수 여부 | 예시 | 설명 |
|:-----|:-----|:---------|:----|:----|
| identifier.uuid | string(UUID) | N | `a1e2b3c4-d5f6-7890-abcd-ef1234567890` | UUID 형식 식별자 |
| birthdate | string | Y | `1990-01-01` | 생년월일 (YYYY-MM-DD) |
| contractor | string | N | `이주헌` | 계약자 이름 |

### 응답

#### Status Codes

| HTTP Status | 설명 |
|:------------|:-----|
| 200 OK | 요청 성공 |
| 400 Bad Request | 잘못된 요청 |
| 401 Unauthorized | 인증 실패 |
| 500 Internal Server Error | 서버 내부 오류 |

#### Response Body

| 이름                                | 타입     | 설명                  |
|-----------------------------------|--------|---------------------|
| code                              | number | 결과 코드 (1=성공, 기타=오류) |
| message                           | string | 결과 메시지              |
| result                            | object | 납입 정보 객체            |
| result.totalCount                 | number | 총 납입 횟수             |
| result.paidCount                  | number | 납입 완료 횟수            |
| result.notPaidCount               | number | 미납 횟수               |
| result.totalAmount                | number | 총 납입 금액             |
| result.paidAmount                 | number | 납입 완료 금액            |
| result.notPaidAmount              | number | 미납 금액               |
| result.monthlyAmount              | number | 월 납입 금액             |
| result.guaranteedTotalAmount      | number | 보장성 총 납입 금액         |
| result.guaranteedPaidAmount       | number | 보장성 납입 완료 금액        |
| result.guaranteedNotPaidAmount    | number | 보장성 미납 금액           |
| result.guaranteedMonthlyAmount    | number | 보장성 월 납입 금액         |
| result.savingTotalAmount          | number | 저축성 총 납입 금액         |
| result.savingPaidAmount           | number | 저축성 납입 완료 금액        |
| result.savingNotPaidAmount        | number | 저축성 미납 금액           |
| result.savingMonthlyAmount        | number | 저축성 월 납입 금액         |
| result.strictPensionTotalAmount   | number | 연금성 총 납입 금액         |
| result.strictPensionPaidAmount    | number | 연금성 납입 완료 금액        |
| result.strictPensionNotPaidAmount | number | 연금성 미납 금액           |
| result.strictPensionMonthlyAmount | number | 연금성 월 납입 금액         |
| result.strictSavingTotalAmount    | number | 연금저축성 총 납입 금액       |
| result.strictSavingPaidAmount     | number | 연금저축성 납입 완료 금액      |
| result.strictSavingNotPaidAmount  | number | 연금저축성 미납 금액         |
| result.strictSavingMonthlyAmount  | number | 연금저축성 월 납입 금액       |
| result.unknowable                 | number | 알 수 없는 항목 수         |
| result.until                      | string | 최종 납입일              |
| result.percent                    | number | 납입 비율(%)            |

### 📄 Response 예시

```json
{
  "code": 1,
  "message": "",
  "result": {
    "totalCount": 120,
    "paidCount": 90,
    "notPaidCount": 30,
    "totalAmount": 6000000,
    "paidAmount": 4500000,
    "notPaidAmount": 1500000,
    "monthlyAmount": 50000,
    "guaranteedTotalAmount": 2000000,
    "guaranteedPaidAmount": 1500000,
    "guaranteedNotPaidAmount": 500000,
    "guaranteedMonthlyAmount": 20000,
    "savingTotalAmount": 1000000,
    "savingPaidAmount": 700000,
    "savingNotPaidAmount": 300000,
    "savingMonthlyAmount": 10000,
    "strictPensionTotalAmount": 500000,
    "strictPensionPaidAmount": 300000,
    "strictPensionNotPaidAmount": 200000,
    "strictPensionMonthlyAmount": 5000,
    "strictSavingTotalAmount": 500000,
    "strictSavingPaidAmount": 400000,
    "strictSavingNotPaidAmount": 100000,
    "strictSavingMonthlyAmount": 4000,
    "unknowable": 0,
    "until": "2025-01-01",
    "percent": 75
  }
}
```

## GET /scrapping/v1/payment_timeline

### 개요
> 계약의 납입 타임라인을 조회합니다.
> 납입기간이 남은 계약들을 집계하여 최종 납입일까지 어느 시점마다 얼마의 납입금을 부담해야하는지를 표시합니다.

### 요청

- **Method**: `GET`
- **URL**: `/scrapping/v1/payment_timeline`
- **Content-Type**: application/json
- **Headers**:
    - `X-Api-Key: {token}`

#### Query String Parameters

| 이름              | 타입           | 필수 여부 | 예시                                     | 설명                |
|-----------------|--------------|-------|----------------------------------------|-------------------|
| identifier.uuid | string(UUID) | Y     | `a1e2b3c4-d5f6-7890-abcd-ef1234567890` | UUID 식별자          |
| birthdate       | string       | Y     | `1990-01-01`                           | 생년월일 (YYYY-MM-DD) |
| contractor      | string       | N     | `이주헌`                                  | 계약자 이름            |

### 응답

#### Status Codes

| HTTP Status | 설명 |
|:------------|:-----|
| 200 OK | 요청 성공 |
| 400 Bad Request | 잘못된 요청 |
| 401 Unauthorized | 인증 실패 |
| 500 Internal Server Error | 서버 내부 오류 |

#### Response Body

| 이름                                       | 타입            | 설명                  |
|------------------------------------------|---------------|---------------------|
| code                                     | number        | 결과 코드 (1=성공, 기타=오류) |
| message                                  | string        | 결과 메시지              |
| result                                   | array<object> | 납입 타임라인 목록          |
| result[].paymentDate                     | string        | 납입일자                |
| result[].totalPaymentAmount              | number        | 해당 일자의 총 납입 금액      |
| result[].paymentCount                    | number        | 해당 일자의 납입 건수        |
| result[].payments                        | array<object> | 해당 일자의 상세 납입 목록     |
| result[].payments[].totalAmount          | number        | 총 납입액               |
| result[].payments[].paidAmount           | number        | 납입 완료액              |
| result[].payments[].notPaidAmount        | number        | 미납액                 |
| result[].payments[].totalCount           | number        | 총 납입 횟수             |
| result[].payments[].paidCount            | number        | 납입 완료 횟수            |
| result[].payments[].notPaidCount         | number        | 미납 횟수               |
| result[].payments[].percent              | number        | 납입 비율(%)            |
| result[].payments[].companyName          | string        | 보험사명                |
| result[].payments[].companyPhoneNumber   | string        | 보험사 전화번호            |
| result[].payments[].companyFaxNumber     | string        | 보험사 팩스번호            |
| result[].payments[].companyLogoUrl       | string        | 보험사 로고 URL          |
| result[].payments[].productName          | string        | 상품명                 |
| result[].payments[].productDisclosureUrl | string        | 상품 약관 URL           |
| result[].payments[].productType          | string        | 상품 유형               |
| result[].payments[].paymentStartDate     | string        | 납입 시작일              |
| result[].payments[].paymentEndDate       | string        | 납입 종료일              |
| result[].payments[].contractor           | string        | 계약자                 |
| result[].payments[].premium              | number        | 보험료                 |
| result[].payments[].premiumCycle         | string        | 납입 주기               |
| result[].payments[].premiumDuration      | number        | 납입 기간               |

### 📄 Response 예시

```json
{
  "code": 1,
  "message": "",
  "result": [
    {
      "paymentDate": "2025-01-01",
      "totalPaymentAmount": 100000,
      "paymentCount": 2,
      "payments": [
        {
          "totalAmount": 6000000,
          "paidAmount": 4500000,
          "notPaidAmount": 1500000,
          "totalCount": 120,
          "paidCount": 90,
          "notPaidCount": 30,
          "percent": 75,
          "companyName": "시그널플로우생명보험",
          "companyPhoneNumber": "02-1234-5678",
          "companyFaxNumber": "02-8765-4321",
          "companyLogoUrl": "https://example.com/logo.png",
          "productName": "좋은암보험",
          "productDisclosureUrl": "https://example.com/disclosure",
          "productType": "정기보험",
          "paymentStartDate": "2023-01-01",
          "paymentEndDate": "2033-01-01",
          "contractor": "이주헌",
          "premium": 50000,
          "premiumCycle": "월납",
          "premiumDuration": 120
        }
        // ...
      ]
    }
    // ...
  ]
}
```

## GET /scrapping/v1/coverage_analysis

### 개요
> 계약의 보장 분석 정보를 조회합니다.
> 각 분류 항목별로, 담보가 항목에 포함되는 경우를 합산하고 보장기간을 계산하여 언제까지 해당 분류 항목으로 얼마나 보장받을 수 있는지를 표시합니다.

### 요청

- **Method**: `GET`
- **URL**: `/scrapping/v1/coverage_analysis`
- **Content-Type**: application/json
- **Headers**:
    - `X-Api-Key: {token}`

#### Query String Parameters

| 이름              | 타입           | 필수 여부 | 예시                                     | 설명                |
|-----------------|--------------|-------|----------------------------------------|-------------------|
| identifier.uuid | string(UUID) | Y     | `a1e2b3c4-d5f6-7890-abcd-ef1234567890` | UUID 식별자          |
| birthdate       | string       | Y     | `1990-01-01`                           | 생년월일 (YYYY-MM-DD) |
| contractor      | string       | N     | `이주헌`                                  | 계약자 이름            |

### 응답

#### Status Codes

| HTTP Status | 설명 |
|:------------|:-----|
| 200 OK | 요청 성공 |
| 400 Bad Request | 잘못된 요청 |
| 401 Unauthorized | 인증 실패 |
| 500 Internal Server Error | 서버 내부 오류 |

#### Response Body

| 이름                                                     | 타입            | 설명                  |
|--------------------------------------------------------|---------------|---------------------|
| code                                                   | number        | 결과 코드 (1=성공, 기타=오류) |
| message                                                | string        | 결과 메시지              |
| result                                                 | array<object> | 보장 분석 결과            |
| result[].guarantyType                                  | string        | 보장 유형 (예: 뇌혈관질환수술비) |
| result[].graphData                                     | array<object> | 보장 분석 그래프 데이터       |
| result[].graphData[].coverDate                         | string        | 보장 시점 (일자)          |
| result[].graphData[].coverAge                          | number        | 보장 시점의 나이           |
| result[].graphData[].totalCoverageAmount               | number        | 해당 시점 총 보장금액        |
| result[].graphData[].guarantyCount                     | number        | 해당 시점 보장 건수         |
| result[].graphData[].guaranties                        | array<object> | 보장 상세 목록            |
| result[].graphData[].guaranties[].coverDate            | string        | 보장 종료 시점            |
| result[].graphData[].guaranties[].coverAge             | number        | 보장 종료 시점의 나이        |
| result[].graphData[].guaranties[].companyName          | string        | 보험사명                |
| result[].graphData[].guaranties[].companyPhoneNumber   | string        | 보험사 전화번호            |
| result[].graphData[].guaranties[].companyFaxNumber     | string        | 보험사 팩스번호            |
| result[].graphData[].guaranties[].companyLogoUrl       | string        | 보험사 로고 URL          |
| result[].graphData[].guaranties[].productName          | string        | 상품명                 |
| result[].graphData[].guaranties[].productDisclosureUrl | string        | 상품 약관 URL           |
| result[].graphData[].guaranties[].productType          | string        | 상품 유형               |
| result[].graphData[].guaranties[].code                 | string        | 보장 코드               |
| result[].graphData[].guaranties[].guarantyName         | string        | 보장명                 |
| result[].graphData[].guaranties[].companyGuarantyName  | string        | 보험사 제공 보장명          |
| result[].graphData[].guaranties[].coverStartDate       | string        | 보장 시작일              |
| result[].graphData[].guaranties[].coverEndDate         | string        | 보장 종료일              |
| result[].graphData[].guaranties[].coverageAmount       | number        | 보장 금액               |

### 📄 Response 예시

```json
{
  "code": 1,
  "message": "",
  "result": [
    {
      "guarantyType": "뇌혈관질환수술비",
      "graphData": [
        {
          "coverDate": "2044-07-16",
          "coverAge": 65,
          "totalCoverageAmount": "20300000",
          "guarantyCount": 4,
          "guaranties": [
            {
              "coverDate": "2069-05-29",
              "coverAge": 89.9,
              "companyName": "시그널플로우생명보험",
              "companyPhoneNumber": "02-1234-5678",
              "companyFaxNumber": "02-8765-4321",
              "companyLogoUrl": "https://example.com/logo.png",
              "productName": "좋은암보험",
              "productDisclosureUrl": "https://example.com/disclosure",
              "productType": "정기보험",
              "code": "A5100",
              "guarantyName": "질병수술",
              "companyGuarantyName": "질병수술비",
              "coverStartDate": "2024-05-29",
              "coverEndDate": "2069-05-29",
              "coverageAmount": "300000"
            }
            // ...
          ]
        }
        // ...
      ]
    }
  ]
}
```

## GET /scrapping/v1/guaranty_types

### 개요
> 제공하고 있는 보장분류 항목을 반환합니다.

### 요청

- **Method**: `GET`
- **URL**: `/scrapping/v1/guaranty_types`
- **Content-Type**: application/json
- **Headers**:
    - `X-Api-Key: {token}`

### 응답

#### Status Codes

| HTTP Status | 설명 |
|:------------|:-----|
| 200 OK | 요청 성공 |
| 400 Bad Request | 잘못된 요청 |
| 401 Unauthorized | 인증 실패 |
| 500 Internal Server Error | 서버 내부 오류 |

#### Response Body

| 이름                | 타입            | 설명                  |
|-------------------|---------------|---------------------|
| code              | number        | 결과 코드 (1=성공, 기타=오류) |
| message           | string        | 결과 메시지              |
| result            | array<object> | 보장 분류 항목            |
| result[].name     | string        | 보장 유형 (예: 뇌혈관질환수술비) |
| result[].category | array<string> | 보장 유형이 속한 카테고리      |

### 📄 Response 예시

```json
{
  "code": 1,
  "message": "",
  "result": [
    {
      "name": "질병수술비",
      "category": [
        "수술",
        "질병"
      ]
    },
    //...
  ]
}