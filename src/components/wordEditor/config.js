let config = {
  document: {
    async: true,
    fileType: 'docx',
    key: 'Khirz6zTPdfd7',
    title: 'SampleText',
    url: 'https://example.com/url-to-example-document.docx',
    permissions: {
      comment: true,
      download: false,
      edit: true,
      fillForms: true,
      print: false,
      review: true
    }
  },
  documentType: 'text',
  editorConfig: {
    callbackUrl: 'https://example.com/url-to-callback.ashx',
    lang: 'zh-CN',
    commentAuthorOnly: true,
    compactToolbar: true,
    region: 'zh-CN',
    customization: {
      autosave: true,
      chat: true,
      commentAuthorOnly: true,
      compactToolbar: true,
      forcesave: true,
      help: false,
      customer: {
        address: '成都市',
        info: '无',
        logo:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFLklEQVRoQ9WaW2wUVRiAv7M7u7TISomRYC9bgVCUghZQtBZMuSiGGH1SpC8k0KCQGBXCRVDciUVRw+yDifrgC4lgsS8aMbZGWy7hrgRpCgYCpFA0EaOxVGh3tzvmdLadoWy7Z8Js0j3JPs3sf/7v/Jfzz3+OYJhhmmYYqAHmA9OAe4FRw/3Hg2ddQAfQDuwD9gghLg0lV6R7kFJ8O/Ai4PdAqTsRkZQQwCYhxOXBgm4DME3zOeALIHQns2bhv9Iyq4QQXzpl3wJgmuZrgAH4sqCAFyJNYJ0QItovbADANM2lgKRL61ZezO6RDAmxTAgh3cpSNuXzbcAYjybJthjpTuUyJvoBdqWyTbYn9lJ+vRBimTBNsxS4OIL9fihomZ0mSYCNgEyZuTg2SYBGYHEuag80SQC56xVlAlh4KcnZHpkAsjMqRwvqS3wE3OXAqxKgW6U8KGzrzY7mDql7J/mYle+KICYBlJa1sDW7AH4Bx6b6KQy4WydlgKJTNkB5vqDSwx1DKj8/JJgXcrX6faTqAL8kBpamdrwPvWRkVBvqAMccABN86KW5BnA4blvgPh/6RKvKbu822dae5O+4UighBDwaEqwP+z0putQtcMABUORDn2wBrDrTy3d/yU3R3djzkMbcAvc+P3gWdYCfYrYFSvzoZRbAitMJmq65B9hVoVF9z61umDThZKfJI2PVwdQBmhwApX70ByyA1k6Trb8l6LJDJKMpKsYK3p+moQ3S85s/kkQv9NJcFcCnyKAOsLfHtsBEP3q5llFRNy/I1V+wP8b5LpNPZgV4vlAtSSgDFH9tA6yc7Eef4S3At1eTrD5hxdmUkKBlYVCJXx2gQVYc1lg5xY9eYW2Z5zpN6k7HuZHBhSbkC+pmahQE0/uG0ZbAOGML6Xghz2OA3Q6AqX702RZA7cE4jVfUyozNFRprpqW3nNGaQP76R0eN1wA7b9oWeFBDn5MCaInReFkRYHaANdOHADgVx/jVAbA832MLfO4AmK6hP55yoX+S6EfjXLMfp524bJyg7okABaOGcKGTcYyTDoBarwE+u2FbYIaGXqUWZErLKHs5P8f7fgMu9Mpopb8qB3HJxw6AhzUiT9oAHddN/u2+vZQYmycoVqwwjWNxosdtgCuveg1g/GdbYFaASLUFsPNUnLea7U1u8LLVLQiyPJWxhltS40iM6BEHwNq7PLbAhw6A2QEiqTxds6ebg+1DB/G8Uj+7l2bOKMahGNFDDoANXgNsk72k1D4wJ0DkKatJ/V5zjE+PDG2B1ZVBNi/IHC/GgRjRg7acK1vUvpjUY0B3ADwWIPKMBZBIwo/nElxPEwOhPMGiMg1NoSow9sWI7ncAvOM1wNvXbQtUBoks8faYwGjuIdriAHhXrTmubIHwmzbAiqogkWe9BejsNum8aWey4nEKZnPzTRze0DlggZlhP9VTvSvmVs4N0vZ7L0cv2sngjVSMZUpF6hZYZwNkEur2+eEtY2g4ESf6g13xXt5xt5IY5cZW+PUsAmwdQ8PxONFGC2BUAM5/pATQ19hSai0u3t7F2atqRZvS0jleOqyHaDgaI/p9T5/ya5fksXqRUoz1tRabgKfdTjpC3u9r7uZ8e/1+4EKOHnBM7j9ikod7L40Qt1BVwzpikm/n/CFfCkJaYHeOHLPWCCHqpd65eNC9Xgixo9/Pcu2qwctCCOklA2O4yx4fpC57qFVVqqHn/j3ZeP0K2Kh02cMpf9B1m3JgPODyEMi1xvKz7E9A3hxokcoLIeQ5dtrxPxtmFih2hNqIAAAAAElFTkSuQmCC',
        mail: '#',
        name: '#',
        www: window.location.host
      },
      showReviewChanges: false,
      zoom: 100,
      logo: {
        image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFLklEQVRoQ9WaW2wUVRiAv7M7u7TISomRYC9bgVCUghZQtBZMuSiGGH1SpC8k0KCQGBXCRVDciUVRw+yDifrgC4lgsS8aMbZGWy7hrgRpCgYCpFA0EaOxVGh3tzvmdLadoWy7Z8Js0j3JPs3sf/7v/Jfzz3+OYJhhmmYYqAHmA9OAe4FRw/3Hg2ddQAfQDuwD9gghLg0lV6R7kFJ8O/Ai4PdAqTsRkZQQwCYhxOXBgm4DME3zOeALIHQns2bhv9Iyq4QQXzpl3wJgmuZrgAH4sqCAFyJNYJ0QItovbADANM2lgKRL61ZezO6RDAmxTAgh3cpSNuXzbcAYjybJthjpTuUyJvoBdqWyTbYn9lJ+vRBimTBNsxS4OIL9fihomZ0mSYCNgEyZuTg2SYBGYHEuag80SQC56xVlAlh4KcnZHpkAsjMqRwvqS3wE3OXAqxKgW6U8KGzrzY7mDql7J/mYle+KICYBlJa1sDW7AH4Bx6b6KQy4WydlgKJTNkB5vqDSwx1DKj8/JJgXcrX6faTqAL8kBpamdrwPvWRkVBvqAMccABN86KW5BnA4blvgPh/6RKvKbu822dae5O+4UighBDwaEqwP+z0putQtcMABUORDn2wBrDrTy3d/yU3R3djzkMbcAvc+P3gWdYCfYrYFSvzoZRbAitMJmq65B9hVoVF9z61umDThZKfJI2PVwdQBmhwApX70ByyA1k6Trb8l6LJDJKMpKsYK3p+moQ3S85s/kkQv9NJcFcCnyKAOsLfHtsBEP3q5llFRNy/I1V+wP8b5LpNPZgV4vlAtSSgDFH9tA6yc7Eef4S3At1eTrD5hxdmUkKBlYVCJXx2gQVYc1lg5xY9eYW2Z5zpN6k7HuZHBhSbkC+pmahQE0/uG0ZbAOGML6Xghz2OA3Q6AqX702RZA7cE4jVfUyozNFRprpqW3nNGaQP76R0eN1wA7b9oWeFBDn5MCaInReFkRYHaANdOHADgVx/jVAbA832MLfO4AmK6hP55yoX+S6EfjXLMfp524bJyg7okABaOGcKGTcYyTDoBarwE+u2FbYIaGXqUWZErLKHs5P8f7fgMu9Mpopb8qB3HJxw6AhzUiT9oAHddN/u2+vZQYmycoVqwwjWNxosdtgCuveg1g/GdbYFaASLUFsPNUnLea7U1u8LLVLQiyPJWxhltS40iM6BEHwNq7PLbAhw6A2QEiqTxds6ebg+1DB/G8Uj+7l2bOKMahGNFDDoANXgNsk72k1D4wJ0DkKatJ/V5zjE+PDG2B1ZVBNi/IHC/GgRjRg7acK1vUvpjUY0B3ADwWIPKMBZBIwo/nElxPEwOhPMGiMg1NoSow9sWI7ncAvOM1wNvXbQtUBoks8faYwGjuIdriAHhXrTmubIHwmzbAiqogkWe9BejsNum8aWey4nEKZnPzTRze0DlggZlhP9VTvSvmVs4N0vZ7L0cv2sngjVSMZUpF6hZYZwNkEur2+eEtY2g4ESf6g13xXt5xt5IY5cZW+PUsAmwdQ8PxONFGC2BUAM5/pATQ19hSai0u3t7F2atqRZvS0jleOqyHaDgaI/p9T5/ya5fksXqRUoz1tRabgKfdTjpC3u9r7uZ8e/1+4EKOHnBM7j9ikod7L40Qt1BVwzpikm/n/CFfCkJaYHeOHLPWCCHqpd65eNC9Xgixo9/Pcu2qwctCCOklA2O4yx4fpC57qFVVqqHn/j3ZeP0K2Kh02cMpf9B1m3JgPODyEMi1xvKz7E9A3hxokcoLIeQ5dtrxPxtmFih2hNqIAAAAAElFTkSuQmCC',
        imageEmbedded: '#',
        url: window.location.host
      }
    }
  }
};
export default config;
