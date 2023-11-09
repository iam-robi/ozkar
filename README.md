# 0zkar

zk framework and tooling for healthcare and federated learning, using o1js. Healthcare privacy, boosted with collaboration features. 

You are on the js framework repo. Other components are:

**Documentation**: https://docs.ozkar.io
**Playground**: https://playground.ozkar.io

As early stage a first module is at POC stage the sequence-verifier module.

```
yarn add @ozkarjs/sequence-verifiers
```

### Sequence verifiers

The first focus of ozkar is the sequence verifier module. sequence verification allaow a variety of use cases. Sequence verification support DNA but also protein sequences offering new possibilities for private verification of data in healthcare world. This opens up use cases for zk in drug discovery, diagnosis, real life studies and more.

There will be challenges on the road, while protein sequences can be smaller to prove DNA sequences can be large and will require scalability solutions. 
The example below will download the dna data for bacteria e.coli, one of the smallest dna for a life specy. in this dna(500K characters) we aim to prove the presence of lacZ genes ( 3600+ characters). 

To the get dna data:

```
curl --output data/ecoli_dna_toplevel.fa.gz https://ftp.ensemblgenomes.ebi.ac.uk/pub/bacteria/release-57/fasta/bacteria_26_collection/escherichia_coli_w_gca_000184185/dna/Escherichia_coli_w_gca_000184185.ASM18418v1_.dna.toplevel.fa.gz

```
