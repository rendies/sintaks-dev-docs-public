---
title: Harga dan saldo
description: Cara mengubah top up IDR menjadi saldo dan cara request ditagih.
---

## Saldo

Saldo Anda adalah nominal IDR yang Anda depositkan dalam rupiah. Top up melalui
iPaymu (QRIS, virtual account, e-wallet) akan langsung menambah saldo sesuai
nominal yang dibayarkan.

Anda tidak perlu memperhatikan unit di balik layar: nilai yang Anda lihat dan
bayarkan selalu dalam Rupiah. Saldo tidak pernah kedaluwarsa.

## Reservation dan settlement

Setiap request berbayar diukur dalam dua tahap:

1. **Reserve** biaya maksimum sebelum memanggil provider. Jika saldo tidak
   mencukupi, request gagal dengan `402` sebelum panggilan ke provider dilakukan.
2. **Settle** biaya aktual setelah provider melaporkan pemakaian. Selisihnya
   akan langsung dikembalikan (atau ditagihkan) ke saldo Anda.

Request yang tidak pernah mencapai provider akan dikembalikan sepenuhnya.
Request yang gagal di upstream tetapi telah menggunakan token tetap ditagihkan
sesuai pemakaian dan ditandai dalam usage history Anda.

## Usage history

**Usage & Audit Log** pada portal customer menampilkan request yang telah di-settle, jumlah token, penghematan cache, refund, model, pricing version, dan provider status berdasarkan gateway request ID.
telah di-settle, lengkap dengan token reserved, token settled, refund, model,
pricing version, dan status provider. Setiap catatan menggunakan gateway request
ID sebagai key.

## Harga per token

Tarif per token ditentukan oleh pricing version organisasi Anda. Katalog model
dan tarif tersedia setelah Anda login di portal. Dokumentasi endpoint tersedia
di [referensi API](/id/reference/endpoints/).