pub mod constant;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use constant::*;
use instructions::*;
use state::*;

declare_id!("Pb2JznuDVXcsHtB5ENj5ku12x1yzuXnyPd1GJXJEUoH");

#[program]
pub mod solana_swap {
    use super::*;

    pub fn make_offer(
        ctx: Context<MakeOffer>,
        id: u64,
        token_a_offered_amount: u64,
        token_b_wanted_amount: u64,
    ) -> Result<()> {
        instructions::make_offer::send_offered_tokens_to_vault(&ctx, token_a_offered_amount)?; 
        instructions::make_offer::save_offer(ctx, id, token_b_wanted_amount)?;
        Ok(())
    }

    pub fn take_offer(
        ctx: Context<TakeOffer>,
    ) -> Result<()> {
        instructions::take_offer::send_wanted_tokens_to_maker(&ctx)?;
        instructions::take_offer::withdraw_and_close_vault(&ctx)?;
        Ok(())
    }
}
