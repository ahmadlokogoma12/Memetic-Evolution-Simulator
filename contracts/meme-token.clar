;; Meme Token Contract

(define-fungible-token meme-token)

(define-map memes
  { meme-id: uint }
  {
    creator: principal,
    content: (string-utf8 280),
    popularity: uint,
    mutation-rate: uint,
    created-at: uint
  }
)

(define-data-var meme-count uint u0)

(define-public (create-meme (content (string-utf8 280)))
  (let
    (
      (new-meme-id (+ (var-get meme-count) u1))
    )
    (try! (ft-mint? meme-token u100 tx-sender))
    (map-set memes
      { meme-id: new-meme-id }
      {
        creator: tx-sender,
        content: content,
        popularity: u0,
        mutation-rate: u5,
        created-at: block-height
      }
    )
    (var-set meme-count new-meme-id)
    (ok new-meme-id)
  )
)

(define-public (propagate-meme (meme-id uint) (new-content (string-utf8 280)))
  (let
    (
      (original-meme (unwrap! (map-get? memes { meme-id: meme-id }) (err u404)))
      (new-meme-id (+ (var-get meme-count) u1))
    )
    (try! (ft-transfer? meme-token u10 tx-sender (get creator original-meme)))
    (map-set memes
      { meme-id: new-meme-id }
      {
        creator: tx-sender,
        content: new-content,
        popularity: u0,
        mutation-rate: (+ (get mutation-rate original-meme) u1),
        created-at: block-height
      }
    )
    (var-set meme-count new-meme-id)
    (ok new-meme-id)
  )
)

(define-read-only (get-meme (meme-id uint))
  (ok (unwrap! (map-get? memes { meme-id: meme-id }) (err u404)))
)

(define-read-only (get-meme-count)
  (ok (var-get meme-count))
)

