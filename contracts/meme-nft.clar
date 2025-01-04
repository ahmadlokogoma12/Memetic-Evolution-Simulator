;; Meme NFT Contract

(define-non-fungible-token meme-milestone uint)

(define-map meme-milestones
  { milestone-id: uint }
  {
    meme-id: uint,
    achievement: (string-utf8 100),
    timestamp: uint
  }
)

(define-data-var milestone-count uint u0)

(define-public (mint-milestone (meme-id uint) (achievement (string-utf8 100)))
  (let
    (
      (new-milestone-id (+ (var-get milestone-count) u1))
    )
    (try! (nft-mint? meme-milestone new-milestone-id tx-sender))
    (map-set meme-milestones
      { milestone-id: new-milestone-id }
      {
        meme-id: meme-id,
        achievement: achievement,
        timestamp: block-height
      }
    )
    (var-set milestone-count new-milestone-id)
    (ok new-milestone-id)
  )
)

(define-read-only (get-milestone (milestone-id uint))
  (ok (unwrap! (map-get? meme-milestones { milestone-id: milestone-id }) (err u404)))
)

(define-read-only (get-milestone-count)
  (ok (var-get milestone-count))
)

