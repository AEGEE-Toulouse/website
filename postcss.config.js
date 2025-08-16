module.exports = {
  plugins: [
    // Résolution des @import en premier
    require('postcss-import'),
    
    // Optimisation CSS en production
    require('cssnano')({
      preset: ['default', {
        // Préserver les CSS Cascade Layers
        discardComments: {
          removeAll: false,
          removeAllButFirst: true
        },
        // Préserver l'ordre des règles critiques
        mergeRules: false,
        // Préserver les custom properties (CSS variables)
        normalizeWhitespace: {
          exclude: false
        }
      }]
    })
  ]
};
