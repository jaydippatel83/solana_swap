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
    
}

#[derive(Accounts)]

