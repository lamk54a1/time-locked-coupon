module time_locked_coupon::time_locked_coupon {
    use iota::object;
    use iota::tx_context;
    use iota::transfer;

    /// On-chain coupon that is locked until a specific time
    public struct Coupon has key, store {
        id: object::UID,
        owner: address,
        unlock_time: u64,
        used: bool,
    }

    /// Mint a new time-locked coupon for the sender
    public entry fun mint_coupon(unlock_time: u64, ctx: &mut tx_context::TxContext) {
        let sender = tx_context::sender(ctx);

        let coupon = Coupon {
            id: object::new(ctx),
            owner: sender,
            unlock_time,
            used: false,
        };

        transfer::public_transfer(coupon, sender);
    }

    /// Redeem coupon if:
    /// - caller is owner
    /// - current_time >= unlock_time
    /// - coupon not used yet
    public entry fun redeem_coupon(
        coupon: &mut Coupon,
        current_time: u64,
        ctx: &mut tx_context::TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // ❗ Check owner
        assert!(sender == coupon.owner, 0);

        // ❗ Check time lock
        assert!(current_time >= coupon.unlock_time, 1);

        // ❗ Check not used
        assert!(!coupon.used, 2);

        // ✅ Mark as used (MUTATE DIRECTLY)
        coupon.used = true;
    }
}