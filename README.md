# Team Optimise Experiments

## Getting Started

To start a new project create a directory inside ***/src***. Use a relevant name and keep it short ;)

#### Git flow rules applies - well sort-of

Create your experiment on a ***/feature*** branch.

It's just beneficial. [ Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

[Pull requests](https://bitbucket.org/teamoptimise/experiments/pull-requests/)

### Prerequisites
* Brain
* Node
* Grab a copy of ***@dc/eslint-config*** package from [Dixon's internal registry](https://artifactory.dsg-i.com/api/npm/npm-virtual/)

### Installing

cd to the experiment's directory and run

```
npm install
```

If any permission error please make sure you have write access to all file and folders

#### Mac OS permission: run as superuser
```
sudo npm install
```

## Deployment

Your project must have ***index.js*** as entry point

**Localhost**
```
npm run start [PROJECT DIRECTORY]
```
**Build**
```
npm run build [PROJECT DIRECTORY]
```

## Built With

* [webpack](https://www.npmjs.com/package/webpack) - Bundling
* [Stylus Loader](https://github.com/shama/stylus-loader) - Stylus css loader

## Contributing

## Versioning

[Semantic Versioning 2.0.0](https://semver.org/)

## Authors

* **Tayeb Melksari** - *Initial work*

## License

## Acknowledgments
GOD
