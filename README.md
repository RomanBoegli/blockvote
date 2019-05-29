# Blockvote Fabric Example Network

> This is the "Hello World" of Hyperledger Composer samples, which demonstrates the core functionality of Hyperledger Composer by changing the value of an asset.

This business network defines:

**Participant**
`Regulator`
`Voter`

**Asset**
`Option`
`Poll`

**Transaction**
`vote`
`count`

**Event**
`invalidVote`
`currentResult`
`debug`

**Requirements**
- every invocation must be stored as is
- support different polls with different amount of options
- only pre-registered voters can vote
- voters authenticate by means of signature
- voters can only vote once per poll (no double-votes)
- voters can only vote on polls initiated by its regulator
- invalid votes (not pre-registered, invalid signature, double-vote) must be recorded
- regulators can count the poll

To test this Business Network Definition in the **Test** tab:

Create a `Regulator` participant:

```
participant Regulator identified by regID {
  o String regID
  o String name
}
```

Create a `Voter` participant:

```
participant Voter identified by voterID {
  o String voterID
  o String privatekey
  o String publickey
  --> Regulator reg
}
```
Create a `Poll` asset:

```
asset Poll identified by pollID {
  o String pollID
  o String title
  -->Regulator initiator
}
```
Create a `Option` asset:

```
asset Option identified by optionID {
  o String optionID
  --> Poll poll
  o String text
  --> Voter[] voters
}
```
Submit a `vote` transaction:

```
transaction vote {
  --> Voter voter
  --> Option option
  o String signature
}
```
Submit a `count` transaction:

```
transaction count{
  --> Poll poll
  o String stat
}

```

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
