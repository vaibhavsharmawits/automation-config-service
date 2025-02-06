## Config structure

```
domain:
    // Domain list
  - name: ONDC:TRV11
    versions:
        // version list
      - id: 2.0.0
        usecase:
            // usecase list
          - name: Metro
            // all config for a particular usecase
            flows: "./TRV11/V-2.0.0/metro/flows/index.yaml"
            mock:
              $ref: "src/config/TRV11/V-2.0.0/metro/mock/index.yaml"
```
