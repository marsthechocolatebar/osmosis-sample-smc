#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr, Uint128, QueryRequest};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, GetEstimateSwapResponse, GetSpotPriceResponse, GetPoolInfoResponse};
use crate::state::{State, STATE};

use osmo_bindings::{OsmosisQuery, Swap, SwapAmount, EstimatePriceResponse, PoolStateResponse};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:executor";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        count: msg.count,
        owner: info.sender.clone(),
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("count", msg.count.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Increment {} => try_increment(deps),
        ExecuteMsg::Reset { count } => try_reset(deps, info, count),
    }
}

pub fn try_increment(deps: DepsMut) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        state.count += 1;
        Ok(state)
    })?;

    Ok(Response::new().add_attribute("method", "try_increment"))
}

pub fn try_reset(deps: DepsMut, info: MessageInfo, count: i32) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        if info.sender != state.owner {
            return Err(ContractError::Unauthorized {});
        }
        state.count = count;
        Ok(state)
    })?;
    Ok(Response::new().add_attribute("method", "reset"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps<OsmosisQuery>, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetEstimateSwap { pool_id, denom_in, denom_out, amount } 
            => to_binary(&query_estimate_swap(deps, _env.contract.address, pool_id, denom_in, denom_out, amount)?),
        QueryMsg::GetSpotPrice { swap, with_swap_fee } => to_binary(&query_spot_price(deps, swap, with_swap_fee)?),
        QueryMsg::GetPoolInfo { pool_id } => to_binary(&query_pool_info(deps, pool_id)?)
    }
}

fn query_estimate_swap(deps: Deps<OsmosisQuery>, 
    sender: Addr, 
    pool_id: u64, 
    denom_in: String, 
    denom_out: String, 
    amount: Uint128
) -> StdResult<GetEstimateSwapResponse> {
    let query = QueryRequest::from(OsmosisQuery::EstimateSwap {
        sender: sender.into(),
        first: Swap {
            pool_id,
            denom_in,
            denom_out,
        },
        route: vec![],
        amount: SwapAmount::In(amount) 
    });

    let result: EstimatePriceResponse = deps.querier.query(&query)?;

    Ok(GetEstimateSwapResponse {amount: result.amount})
}

fn query_spot_price(deps: Deps<OsmosisQuery>, swap: Swap, with_swap_fee: bool) -> StdResult<GetSpotPriceResponse> {
    let query = QueryRequest::from(OsmosisQuery::SpotPrice { swap, with_swap_fee });
    let result: GetSpotPriceResponse = deps.querier.query(&query)?;

    Ok(GetSpotPriceResponse { price: result.price })
}
 
fn query_pool_info(deps: Deps<OsmosisQuery>, pool_id: u64) -> StdResult<GetPoolInfoResponse> {

    let pool_query = OsmosisQuery::PoolState { id: pool_id };
    let query = QueryRequest::from(pool_query);

    let pool_info: PoolStateResponse = deps.querier.query(&query)?;
    
    let denom_in= String::from(&pool_info.assets.get(0).unwrap().denom);
    let denom_out = String::from(&pool_info.assets.get(1).unwrap().denom);

    Ok(GetPoolInfoResponse {
        denom_in, denom_out
    })
}
