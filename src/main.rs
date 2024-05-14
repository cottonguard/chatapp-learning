use sea_orm::{ConnectOptions, Database, DatabaseConnection, EntityTrait, QueryOrder, Set};
use std::sync::Arc;
use web1::entity::{post, prelude::*};

use axum::{extract::State, http::StatusCode, routing::get, Json, Router};
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let opt = ConnectOptions::new("sqlite:///Users/w/rust/axum/db.sqlite?mode=rwc");
    let db = Arc::new(Database::connect(opt).await?);

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route(
            "/posts",
            get(posts)
                .post(create_post)
                .patch(update_post)
                .delete(delete_post),
        )
        .with_state(db)
        .layer(
            tower::ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                // .layer(HandleErrorLayer::new(handle_error))
                .layer(CorsLayer::permissive()),
        );

    let listener = tokio::net::TcpListener::bind("127.0.0.1:5000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

#[derive(serde::Serialize)]
struct PostRes {
    id: i32,
    title: String,
    text: String,
    created_at: String,
}

#[derive(serde::Deserialize)]
struct CreatePostPayload {
    title: String,
    text: String,
}

#[derive(serde::Serialize)]
struct CreatePostResponse {
    id: i32,
}

#[derive(serde::Deserialize)]
struct UpdatePostPayload {
    id: i32,
    title: String,
    text: String,
}

#[derive(serde::Serialize)]
struct UpdatePostResponse {
    is_success: bool,
}

#[derive(serde::Deserialize)]
struct DeletePostPayload {
    id: i32,
}

#[derive(serde::Serialize)]
struct DeletePostResponse {
    is_success: bool,
}

async fn posts(
    State(db): State<Arc<DatabaseConnection>>,
) -> Result<Json<Vec<PostRes>>, StatusCode> {
    match Post::find().order_by_desc(post::Column::Id).all(&*db).await {
        Ok(posts) => Ok(Json(
            posts
                .into_iter()
                .map(|p| PostRes {
                    id: p.id,
                    title: p.title,
                    text: p.text,
                    created_at: p.created_at,
                })
                .collect(),
        )),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn create_post(
    State(db): State<Arc<DatabaseConnection>>,
    Json(payload): Json<CreatePostPayload>,
) -> Result<Json<CreatePostResponse>, StatusCode> {
    let entity = post::ActiveModel {
        title: Set(payload.title),
        text: Set(payload.text),
        ..Default::default()
    };
    match Post::insert(entity).exec(&*db).await {
        Ok(res) => Ok(Json(CreatePostResponse {
            id: res.last_insert_id,
        })),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn update_post(
    State(db): State<Arc<DatabaseConnection>>,
    Json(payload): Json<UpdatePostPayload>,
) -> Result<Json<UpdatePostResponse>, StatusCode> {
    match Post::update(post::ActiveModel {
        id: Set(payload.id),
        title: Set(payload.title),
        text: Set(payload.text),
        created_at: sea_orm::ActiveValue::NotSet,
    })
    .exec(&*db)
    .await
    {
        Ok(_res) => Ok(Json(UpdatePostResponse { is_success: true })),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn delete_post(
    State(db): State<Arc<DatabaseConnection>>,
    Json(payload): Json<DeletePostPayload>,
) -> Result<Json<DeletePostResponse>, StatusCode> {
    match Post::delete(post::ActiveModel {
        id: Set(payload.id),
        ..Default::default()
    })
    .exec(&*db)
    .await
    {
        Ok(_res) => Ok(Json(DeletePostResponse { is_success: true })),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
