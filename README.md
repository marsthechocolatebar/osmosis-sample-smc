# Issue

executor contract에서 testnet osmosis pool에 EstimateSwap query 요청 시 아래와 같은 에러가 발생하고 있습니다.

## 재현경로

```bash
$ beaker wasm deploy executor --signer-account test2 --no-wasm-opt --raw '{ "count": 0 }' --network testnet

$ beaker wasm ts-gen executor

$ beaker console --network testnet

```

## 참고 이미지

<img width="1431" alt="image" src="https://user-images.githubusercontent.com/97386162/181875589-a87e57f9-1def-4662-b857-5982f0b9b5d2.png">
