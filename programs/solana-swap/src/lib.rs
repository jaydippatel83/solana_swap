pub mod constant;
pub mod instructions;
pub mod error;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;
use state::*;
use constant::*;
use error::*;


declare_id!("Pb2JznuDVXcsHtB5ENj5ku12x1yzuXnyPd1GJXJEUoH");

#[program]
pub mod solana_swap { 
    use super::*;

    pub fn make_offer(
        ctx: Context<MakeOffer>,
        token_mint_a: Pubkey,
        token_mint_b: Pubkey,
        token_b_wanted_amount: u64,
        ) -> Result<()> {
        instructions::make_offer::send_offered_tokens_to_vault()?;
        instructions::make_offer::save_offer();
    }
}

#[derive(Accounts)]

